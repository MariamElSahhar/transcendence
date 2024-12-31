from django.conf import settings
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from ..models import CustomUser
from ..utils import send_otp, set_response_cookie, update_user_activity
from ..serializers import LoginSerializer, OTPVerificationSerializer, UserSerializer


# LOGIN
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    login_serializer = LoginSerializer(data=request.data)
    if login_serializer.is_valid():
        username = login_serializer.validated_data["username"]
        password = login_serializer.validated_data["password"]
        request.session["password"] = password

        user = CustomUser.objects.filter(username=username).first()
        if user and user.check_password(password):
            if user.is_superuser or not user.enable_otp:
                token_serializer = TokenObtainPairSerializer(
                    data={"username": user.username, "password": password}
                )
                if token_serializer.is_valid():
                    tokens = token_serializer.validated_data
                    response = Response(
                        {
                            "message": "Login Successful.",
                            "data": {
                                "username": user.username,
                                "user_id": user.id,
                                "user_email": user.email,
                                "otp": user.enable_otp,
                                "avatar": user.avatar.url if user.avatar else None,
                            },
                        },
                        status=status.HTTP_200_OK,
                    )
                return set_response_cookie(response, tokens, user, True)
            elif user.enable_otp:
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
        request.session["password"] = password
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


# OTP VERIFICATION
@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp_view(request):
    serializer = OTPVerificationSerializer(data=request.data)
    # The serializer will validate OTP and expiration
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        password = request.session.get("password")

        # Issue tokens here after successful OTP verification
        token_serializer = TokenObtainPairSerializer(
            data={"username": user.username, "password": password}
        )

        if token_serializer.is_valid():
            tokens = token_serializer.validated_data
            response = Response(
                {
                    "message": "OTP verified successfully. Login successful.",
                    "data": {
                        "username": user.username,
                        "user_id": user.id,
                        "user_email": user.email,
                        "otp": user.enable_otp,
                        "avatar": user.avatar.url if user.avatar else None,
                    },
                },
                status=status.HTTP_200_OK,
            )
            response = set_response_cookie(response, tokens, user, True)
            del request.session["password"]
            return response
        else:
            error_messages = []
            for _, errors in token_serializer.errors.items():
                error_messages.extend(errors)
            return Response(
                {"error": error_messages}, status=status.HTTP_400_BAD_REQUEST
            )
    else:
        error_messages = []
        for _, errors in serializer.errors.items():
            error_messages.extend(errors)
        return Response({"error": error_messages}, status=status.HTTP_400_BAD_REQUEST)


# LOGOUT
@api_view(["POST"])
def logout_view(request):
    response = Response(
        {"message": "Logout successful.",},
        status=status.HTTP_200_OK,
    )
    # remove both access and refresh tokens
    response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"])
    response.delete_cookie("refresh_token")
    # update status to offline, save last seen to now
    update_user_activity(request.user, False)
    return response
