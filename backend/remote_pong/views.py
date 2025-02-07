from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from .models import MatchmakingQueue, GameSession
from users.models import CustomUser
from pong.consumers import notify_match
import time

# TEST VIEW
@api_view(["GET"])
@permission_classes([AllowAny])
def test_view(request):
    return Response({"message": "Hello from remote-pong api!"}, status=status.HTTP_200_OK)

@transaction.atomic
@api_view(["POST","DELETE"])
def match_maker(request):
	if request.META["REMOTE_ADDR"] == '127.0.0.1':
		same_system = True
	else:
		same_system = False
	if request.method == "POST":
		player = request.user
		user1 =  CustomUser.objects.get(username=player)
		other_player = MatchmakingQueue.objects.exclude(player=player).first()
		if MatchmakingQueue.objects.filter(player=player).exists() and not other_player:
			return Response({"message": "You are already in the queue"}, status=400)
		if not MatchmakingQueue.objects.filter(player=player).exists():
			MatchmakingQueue.objects.create(player=player)
		if other_player:
			game_session = GameSession.objects.create(
				player1=other_player.player, player2=player, status='active'
			)
			user2 = CustomUser.objects.get(username = other_player.player)
			MatchmakingQueue.objects.filter(player__in=[player, other_player.player]).delete()
			# wait_for_connection(user1)  #
			time.sleep(0.1)
			notify_match(user1, user2,game_session.id)
			return Response(
				{
					"message": "Match found!",
					"game_session_id": game_session.id
				}
			)

		return Response({"message": "Waiting for a match..."})
	elif request.method=="DELETE":
		MatchmakingQueue.objects.filter(player=request.user).delete()
		return Response(
				{
					"message": "Successfully deleted!"
				}
			)
