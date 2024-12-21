from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

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
    if user.is_authenticated:
        data = request.data.copy()
        data["user"] = user.id
        serializer = RemoteGameSerializer(data=data, context={"request": request})
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
@api_view(["GET"])
def gamelog(request):
    user = request.user
    username = request.query_params.get(
        "username", user.username if user.is_authenticated else None
    )

    if not username:
        return Response(
            {"error": "Authentication required to view game logs."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    target_user = CustomUser.objects.filter(username=username).first()
    if not target_user:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    remote_games = RemoteGameLog.objects.filter(users=target_user, game_type="Remote")
    local_games = LocalGameLog.objects.filter(users=target_user, game_type="Local")

    print(f"Remote games: {remote_games}")
    print(f"Local games: {local_games}")

    response_data = {
        "remote": RemoteGameSerializer(remote_games, many=True).data,
        "local": LocalGameSerializer(local_games, many=True).data,
    }
    return Response(response_data)
