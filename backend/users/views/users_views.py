from uuid import uuid4
import os
from urllib.parse import urlparse
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
import base64

from ..models import CustomUser
from ..utils import send_otp
from ..serializers import UserSerializer, ProfileSerializer, FriendSerializer

# GET USERS
@api_view(["GET"])
def user_list_create_view(request):
    if request.method == "GET":
        username = request.query_params.get('username', None)
        if username:
            users = CustomUser.objects.filter(username__istartswith=username)
        else:
            users = CustomUser.objects.all()
        serializer = ProfileSerializer(users, many=True)
        return Response({"message": "Users retrieved", "data": serializer.data})

# GET, UPDATE, OR DELETE A USER BY ID
@api_view(["GET", "PATCH", "DELETE"])
def user_retrieve_update_destroy_view(request, user_id):
    # get user by ID
    if request.method == "GET":
        user = CustomUser.objects.filter(id=user_id).first()
        if not user:
            return Response({"error": "User not found.", "exists": False}, status=status.HTTP_404_NOT_FOUND)
        if request.user.id != user_id:
            serializer = FriendSerializer(user, context={'request': request})
        else:
            serializer = ProfileSerializer(user)

        return Response({"data": serializer.data, "exists": True}, status=status.HTTP_200_OK)

    # update/delete user by ID
    else:
        if request.user.id != user_id:
            return Response({"error": "Not authorized."}, status=status.HTTP_401_UNAUTHORIZED)
        user = request.user
        if request.method == "PATCH":
            serializer = UserSerializer(user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            if "password" in serializer.validated_data:
                user = serializer.save(password=make_password(serializer.validated_data["password"]))
            else:
                serializer.save()
            return Response({"message": "User modified", "data": serializer.data}, status=status.HTTP_201_CREATED)

        if request.method == "DELETE":
            try:
                user.delete()
                return Response({"message": "User deleted"}, status=status.HTTP_204_NO_CONTENT)
            except Exception as e:
                return Response({"error": f"Failed to delete user: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ADD OR DELETE USER AVATAR
@api_view(["POST", "DELETE"])
def avatar_view(request, user_id):
    if user_id != request.user.id:
        return Response({"error": "You may only edit your own avatar."}, status=status.HTTP_401_UNAUTHORIZED)
    user = request.user
    if request.method == "POST":
        try:
            avatar_data = request.data.get("avatar")
            if not avatar_data:
                return Response({"error": "Avatar data is missing."}, status=status.HTTP_400_BAD_REQUEST)
            if avatar_data.find(";base64,") == -1:
                if not user.avatar.name.startswith("default_avatar/"):
                    user.avatar.delete()
                parsed_url = urlparse(avatar_data)
                relative_path = parsed_url.path.lstrip('/')
                user.avatar.name = relative_path.replace("media/","")
            else:
                file_format, imgstr = avatar_data.split(";base64,")[0],avatar_data.split(";base64,")[1]
                ext = file_format.split("/")[-1]
                avatar_file = ContentFile(base64.b64decode(imgstr), name=f"{user_id}_avatar{uuid4().hex}.{ext}")
                if not user.avatar.name.startswith("default_avatar/"):
                    user.avatar.delete()
                user.avatar.save(f"{user_id}_avatar{uuid4().hex}.{ext}", avatar_file)
            user.save()
            response = Response({"message": "Avatar uploaded successfully!", "data":{"avatar": user.avatar.url}}, status=status.HTTP_200_OK)
            return response
        except Exception as e:
            return Response({"error": f"Failed to upload avatar: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == "DELETE":
        try:
            if not user.avatar:
                return Response({"message": "No avatar to delete"}, status=status.HTTP_204_NO_CONTENT)
            if not user.avatar.name.startswith("default_avatar/"):
                user.avatar.delete()
            user.avatar.name =  "default_avatar/default_avatar.jpg"
            user.save()
            return Response({"message": "Avatar deleted successfully!", "data":{"avatar": user.avatar.url}}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": f"Failed to delete avatar: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# GET DEFAULT AVATAR
@api_view(["GET"])
def get_default_avatars(request):
    default_avatar_path = os.path.join(settings.MEDIA_ROOT, 'default_avatar')
    try:
        avatars = os.listdir(default_avatar_path)
        avatar_urls = [os.path.join(settings.MEDIA_URL, 'default_avatar', avatar) for avatar in avatars]
        return Response({'default_avatars': avatar_urls}, status=status.HTTP_200_OK)
    except FileNotFoundError:
        return Response({'error': 'Default avatar folder not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
