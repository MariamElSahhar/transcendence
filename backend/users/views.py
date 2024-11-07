from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from .models import CustomUser
from .otp_utils import send_otp
from .serializers import UserSerializer


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
@api_view(["GET", "PATCH", "DELETE"])
def user_retrieve_update_destroy_view(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)

    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == "PATCH":
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        if "password" in serializer.validated_data:
            user.password = make_password(serializer.validated_data["password"])
        serializer.save()
        return Response(serializer.data)

    elif request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
