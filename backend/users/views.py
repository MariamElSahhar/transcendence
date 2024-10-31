from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import CustomUser
from .serializers import UserSerializer, LoginSerializer, OTPVerificationSerializer
from .otp_utils import send_otp
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny
from django.conf import settings
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)


# GET OR CREATE NEW USERS
@api_view(["GET", "POST"])
def user_list_create_view(request):
    if request.method == "GET":
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(
            password=make_password(serializer.validated_data["password"])
        )
        send_otp(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# GET, UPDATE, OR DELETE A USER BY ID
@api_view(["GET", "PUT", "DELETE"])
def user_retrieve_update_destroy_view(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)

    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = UserSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(password=make_password(serializer.validated_data["password"]))
        return Response(serializer.data)

    elif request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# LOGIN
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    login_serializer = LoginSerializer(data=request.data)

    if login_serializer.is_valid():
        username = login_serializer.validated_data["username"]
        password = login_serializer.validated_data["password"]

        request.session['password'] = password

        user = CustomUser.objects.filter(username=username).first()

        if user and user.check_password(password) and user.is_superuser is True:
            return Response({"message": "Login Successful."}, status=status.HTTP_200_OK)
        elif user and user.check_password(password) and user.is_superuser is False:
            send_otp(user)
            return Response(
                {"message": "OTP sent to your email."}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED
            )

    error_messages = []
    for _, errors in login_serializer.errors.items():
        error_messages.extend(errors)
    return Response({"error": error_messages}, status=status.HTTP_400_BAD_REQUEST)



# REGISTRATION
@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    user_serializer = UserSerializer(data=request.data)

    if user_serializer.is_valid():
        # Save and handle successful registration
        password = user_serializer.validated_data["password"]
        request.session['password'] = password
        user = user_serializer.save(password=make_password(password))

        # Send OTP
        send_otp(user)

        return Response(
            {"message": "Registration successful. OTP has been sent to your email."},
            status=status.HTTP_201_CREATED,
        )

    error_messages = []
    for _, errors in user_serializer.errors.items():
        error_messages.extend(errors)
    return Response({"error": error_messages}, status=status.HTTP_400_BAD_REQUEST)

# REFRESH TOKEN
@api_view(["POST"])
@permission_classes([AllowAny])
def token_refresh_view(request):
    refresh_token = request.COOKIES.get("refresh_token")
    if refresh_token is None:
        return Response({"error": "Refresh token not provided."}, status=400)

    request.data["refresh"] = refresh_token
    token_serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
    if token_serializer.is_valid():
        tokens = token_serializer.validated_data
        response = Response(
            {"message": "Refresh successful."}, status=status.HTTP_200_OK
        )
        # Access token
        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE"],
            value=tokens["access"],
            expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
        )
        return response
    else:
        error_messages = []
        for _, errors in token_serializer.errors.items():
            error_messages.extend(errors)
        return Response({"error": error_messages}, status=status.HTTP_400_BAD_REQUEST)


# STATUS
@api_view(["GET"])
def token_status_view(request):
    return Response({"message": "Token valid"}, status=status.HTTP_200_OK)

# OTP VERIFICATION
@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp_view(request):
    serializer = OTPVerificationSerializer(data=request.data)

    # The serializer will validate OTP and expiration
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        password = request.session.get('password')

        # Issue tokens here after successful OTP verification
        token_serializer = TokenObtainPairSerializer(
            data={"username": user.username, "password": password}
        )

        if token_serializer.is_valid():
            tokens = token_serializer.validated_data
            response = Response(
                {"message": "OTP verified successfully. Login successful."},
                status=status.HTTP_200_OK,
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                value=tokens["access"],
                expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )
            response.set_cookie(
                key="refresh_token",
                value=tokens["refresh"],
                expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )
            del request.session['password']
        else:
            error_messages = []
            for _, errors in token_serializer.errors.items():
                error_messages.extend(errors)
            return Response({"error": error_messages}, status=status.HTTP_400_BAD_REQUEST)
    else:
        error_messages = []
        for _, errors in serializer.errors.items():
            error_messages.extend(errors)
        return Response({"error": error_messages}, status=status.HTTP_400_BAD_REQUEST)
