from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from itertools import chain
from django.db import models

from users.models import CustomUser
from ..models import RemoteGameLog, LocalGameLog
from ..serializers import (
    RemoteGameSerializer,
    LocalGameSerializer,
    TrimmedGameSerializer,
)


@api_view(["POST"])
def gamelog_remote(request):
    user = request.user
    if request.method == "GET":
        if user.is_authenticated:
            games = LocalGameLog.objects.filter(user=user)
            serializer = LocalGameSerializer(games, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            games = LocalGameLog.objects.all()
            serializer = LocalGameSerializer(games, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        if user.is_authenticated:
            data = request.data.copy()
            data["user"] = user.id
            serializer = LocalGameSerializer(data=data, context={"request": request})
            if serializer.is_valid(raise_exception=True):
                serializer.save(user=user)
                return Response(
                    {"message": "Game history created", "data": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def gamelog_local(request):
    user = request.user
    if request.method == "GET":
        if user.is_authenticated:
            games = LocalGameLog.objects.filter(user=user)
            serializer = LocalGameSerializer(games, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            games = LocalGameLog.objects.all()
            serializer = LocalGameSerializer(games, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        if user.is_authenticated:
            data = request.data.copy()
            data["user"] = user.id
            serializer = LocalGameSerializer(data=data, context={"request": request})
            if serializer.is_valid(raise_exception=True):
                serializer.save(user=user)
                return Response(
                    {"message": "Game history created", "data": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# GET OR CREATE NEW REMOTE GAMESLOGS
@api_view(["GET", "POST"])
def gamelog(request):
    user = request.user

    if request.method == "GET":
        username = request.query_params.get(
            "username", user.username if user.is_authenticated else None
        )

        if not username:
            return Response(
                {"error": "Authentication required to view your game logs."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        target_user = CustomUser.objects.filter(username=username).first()
        if not target_user:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        remote_games = RemoteGameLog.objects.filter(users=target_user)
        local_games = LocalGameLog.objects.filter(user=target_user)

        remote_games = remote_games.annotate(source=models.Value("remote", output_field=models.CharField()))
        local_games = local_games.annotate(source=models.Value("local", output_field=models.CharField()))

        games = chain(remote_games, local_games)
        serializer = TrimmedGameSerializer(
            games, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        if not user.is_authenticated:
            return Response(
                {"error": "Authentication required to create game logs."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = RemoteGameSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                {"message": "Game history created", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
