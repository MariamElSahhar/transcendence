from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from remote_pong.models import  GameSession
from users.models import CustomUser
from .models import RemoteGameLog, LocalGameLog, TicTacToeLog

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
    gamedata = GameSession.objects.get(id=request.data["gameSession"])
    user1 = request.user.id
    user2 = CustomUser.objects.get(username=request.data["opponent_username"]).id
    if(request.data["my_score"] > request.data["opponent_score"]):
        winnerID=user1
        winner_score=request.data["my_score"]
        loserID=user2
        loser_score=request.data["opponent_score"]
    else:
        winnerID=user2
        winner_score=request.data["opponent_score"]
        loserID=user1
        loser_score=request.data["my_score"]
    data={"winnerID":winnerID,"loserID":loserID,"winner_score":winner_score,"loser_score":loser_score}

    serializer = CreateRemoteGameSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {
                "message": "Remote game log created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

    response_data = {
        "local": LocalGameSerializer(
            local_games, many=True, context={"request": request}
        ).data,
        "remote": RemoteGameSerializer(
            remote_games, many=True, context={"request": request}
        ).data,
        "ttt": TicTacToeSerializer(
            ttt_games, many=True, context={"request": request}
        ).data,
    }
    return Response(response_data)
