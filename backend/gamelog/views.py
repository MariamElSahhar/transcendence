from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import CustomUser

from .serializers.local import (
    LocalGameSerializer,
    CreateLocalGameSerializer,
)
from .serializers.remote import (
    RemoteGameSerializer,
    CreateRemoteGameSerializer,
)
from .serializers.ttt import (
    CreateTTTGameSerializer,
    TicTacToeSerializer,
)


@api_view(["POST"])
def create_gamelog_remote(request):
    user1_id = request.user.id
    user2_id = get_object_or_404(CustomUser, username=request.data["opponent_username"]).id

    if request.data["my_score"] > request.data["opponent_score"]:
        winner_id = user1_id
        winner_score = request.data["my_score"]
        loser_id = user2_id
        loser_score = request.data["opponent_score"]
    else:
        winner_id = user2_id
        winner_score = request.data["opponent_score"]
        loser_id = user1_id
        loser_score = request.data["my_score"]

    data = {
        "winner": winner_id,
        "loser": loser_id,
        "winner_score": winner_score,
        "loser_score": loser_score,
    }

    serializer = CreateRemoteGameSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(
            {
                "message": "Remote game log created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


@api_view(["POST"])
def create_gamelog_local(request):
    user = request.user
    datamod = request.data.copy()
    datamod["user"] = user.id

    serializer = CreateLocalGameSerializer(data=datamod)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(
            {
                "message": "Local game log created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def create_gamelog_ttt(request):
    serializer = CreateTTTGameSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {
                "message": "Tictactoe game log created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# GET OR CREATE NEW REMOTE GAMESLOGS
@api_view(["GET"])
def gamelog(request, user_id):
    target_user = CustomUser.objects.filter(id=user_id).first()
    if not target_user:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    remote_games = target_user.remote_games.all().order_by("-date")
    local_games = target_user.local_games.all().order_by("-date")
    ttt_games = target_user.ttt_games.all().order_by("-date")

    local_serializer = LocalGameSerializer(
        local_games, many=True, context={"request": request}
    )
    remote_serializer = RemoteGameSerializer(
        remote_games, many=True, context={"request": request}
    )
    ttt_serializer = TicTacToeSerializer(
        ttt_games, many=True, context={"user_id": user_id}
    )

    local_games_count = len(local_serializer.data)
    remote_games_count = len(remote_serializer.data)
    ttt_games_count = len(ttt_serializer.data)

    local_wins = len(
        [item for item in local_serializer.data if item.get("is_win") is True]
    )
    remote_wins = len(
        [item for item in remote_serializer.data if item.get("is_win") is True]
    )
    ttt_wins = len([item for item in ttt_serializer.data if item.get("is_win") is True])

    response_data = {
        "stats": {
            "localPlayed": local_games_count,
            "localWon": local_wins,
            "remotePlayed": remote_games_count,
            "remoteWon": remote_wins,
            "tttPlayed": ttt_games_count,
            "tttWon": ttt_wins,
            "totalPlayed": local_games_count + remote_games_count + ttt_games_count,
            "totalWon": local_wins + remote_wins + ttt_wins,
        },
        "data": {
            "local": local_serializer.data,
            "remote": remote_serializer.data,
            "ttt": ttt_serializer.data,
        },
    }

    return Response(response_data)
