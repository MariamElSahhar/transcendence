from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from ..models import CustomUser
from ..utils import send_otp
from ..serializers import UserSerializer


# GET OR CREATE NEW USERS
@api_view(["GET", "POST"])
def user_list_create_view(request):
    if request.method == "GET":
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({"message": "Users retrieved", "data": serializer.data})

    elif request.method == "POST":
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(
            password=make_password(serializer.validated_data["password"])
        )
        send_otp(user)
        return Response({"message": "User created", "data": serializer.data}, status=status.HTTP_201_CREATED)


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
        return Response({"message": "User modified", "data": serializer.data}, status=status.HTTP_201_CREATED)

    elif request.method == "DELETE":
        user.delete()
        return Response({"message": "User deleted"}, status=status.HTTP_204_NO_CONTENT)
