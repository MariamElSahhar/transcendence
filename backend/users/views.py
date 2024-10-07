from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserSerializer, LoginSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer


# Get users and create new user
@api_view(["GET", "POST"])
def user_list_create_view(request):
    if request.method == "GET":
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(password=make_password(serializer.validated_data["password"]))
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Get, update, or delete a user by ID
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


# Login
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = TokenObtainPairSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        tokens = serializer.validated_data
        response = Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        # Access token
        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE"],
            value=tokens["access"],
            expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
        )
        # Refresh token
        response.set_cookie(
            key='refresh_token',
            value=tokens["refresh"],
            expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
        )
        print(response.cookies)
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def token_refresh_view(request):
    refresh_token = request.COOKIES.get("refresh_token")

    if refresh_token is None:
        return Response({"detail": "Refresh token not provided"}, status=400)

    request.data["refresh"] = refresh_token

    serializer = TokenRefreshSerializer(data=request.data)
    try:
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=200)
    except Exception as e:
        return Response({"detail": str(e)}, status=400)

# Register
@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(password=make_password(serializer.validated_data["password"]))
        user = CustomUser.objects.get(username=serializer.validated_data["username"])
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "message": "Registration successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
