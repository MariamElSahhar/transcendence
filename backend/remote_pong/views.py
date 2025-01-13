from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from .models import MatchmakingQueue, GameSession
from users.models import CustomUser
from pong.consumers import notify_match

# TEST VIEW
@api_view(["GET"])
@permission_classes([AllowAny])
def test_view(request):
    return Response({"message": "Hello from remote-pong api!"}, status=status.HTTP_200_OK)



@transaction.atomic
@api_view(["POST"])
def join_queue(request):
    player = request.user
    user1 =  CustomUser.objects.get(username=player)
    if MatchmakingQueue.objects.filter(player=player).exists():
        return Response({"message": "You are already in the queue"}, status=400)

    MatchmakingQueue.objects.create(player=player)

    other_player = MatchmakingQueue.objects.exclude(player=player).first()
    if other_player:
        game_session = GameSession.objects.create(
            player1=other_player.player, player2=player, status='active'
        )
        user2 = CustomUser.objects.get(username = other_player.player)
        MatchmakingQueue.objects.filter(player__in=[player, other_player.player]).delete()
        notify_match(user1, user2,game_session.id)
        return Response(
            {
                "message": "Match found!",
                "game_session_id": game_session.id
            }
        )

    return Response({"message": "Waiting for a match..."})
