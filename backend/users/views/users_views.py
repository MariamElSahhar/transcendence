from uuid import uuid4
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view
from rest_framework.response import Response
import base64

from ..models import CustomUser
from ..utils import send_otp
from ..serializers import UserSerializer, ProfileSerializer


# GET OR CREATE NEW USERS
@api_view(["GET", "POST"])
def user_list_create_view(request):
    if request.method == "GET":
        username = request.query_params.get('username', None)
        if username:
            users = CustomUser.objects.filter(username__istartswith=username)
        else:
            users = CustomUser.objects.all()
        serializer = ProfileSerializer(users, many=True)
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
        serializer = ProfileSerializer(user)
        response_data = serializer.data
        response_data["is_friend"] = user in request.user.friends.all()

        return Response(response_data)

    elif request.method == "PATCH":
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        if "password" in serializer.validated_data:
            print(serializer.validated_data["password"])
            user = serializer.save(password=make_password(serializer.validated_data["password"]))
        else:
            serializer.save()
        return Response({"message": "User modified", "data": serializer.data}, status=status.HTTP_201_CREATED)

    elif request.method == "DELETE":
        user.delete()
        response = Response({"message": "User deleted"}, status=status.HTTP_204_NO_CONTENT)
        print(response)
        return Response({"message": "User deleted"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["POST", "DELETE"])
def avatar_view(request, user_id):
    if user_id != request.user.id:
        return Response({"error": "You may only edit your own avatar."}, status=401)
    user = CustomUser.objects.get(id=user_id)
    if request.method == "POST":
        try:
            avatar_data = request.data.get("avatar")
            if not avatar_data:
                return Response({"error": "Avatar data is missing."}, status=400)
            file_format, imgstr = avatar_data.split(";base64,")[0],avatar_data.split(";base64,")[1]
            ext = file_format.split("/")[-1]
            avatar_file = ContentFile(base64.b64decode(imgstr), name=f"{user_id}_avatar{uuid4().hex}.{ext}")
            if user.avatar.name !=  "default_avatar/default_avatar.jpg":
                user.avatar.delete()
            user.avatar.save(f"{user_id}_avatar{uuid4().hex}.{ext}", avatar_file)
            user.save()
            response = Response({"message": "Avatar uploaded successfully!", "data":{"avatar": user.avatar.url}}, status=200)
            print(response.data)
            return response
        except Exception as e:
            return Response({"error": f"Failed to upload avatar: {str(e)}"}, status=400)
    elif request.method == "DELETE":
        try:
            if not user.avatar:
                return Response({"error": "No avatar to delete."}, status=404)
            if user.avatar.name !=  "default_avatar/default_avatar.jpg":
                user.avatar.delete()
            user.avatar.name =  "default_avatar/default_avatar.jpg"
            user.save()
            return Response({"message": "Avatar deleted successfully!", "data":{"avatar": user.avatar.url}}, status=200)
        except Exception as e:
            return Response({"error": f"Failed to delete avatar: {str(e)}"}, status=400)
