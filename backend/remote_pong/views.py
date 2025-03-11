from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from .models import MatchmakingQueue, GameSession
from users.models import CustomUser
from asgiref.sync import async_to_sync
from pong.consumers import notify_match
import time
import socket

@transaction.atomic
@api_view(["POST","DELETE"])
def match_maker(request):
	systemID=request.data.get("systemID")
	if request.method == "POST":
		with transaction.atomic():
			player = request.user
			user1 =  CustomUser.objects.get(username=player)
			other_player = MatchmakingQueue.objects.exclude(player=player).select_for_update().order_by('joined_at').first()
			if MatchmakingQueue.objects.filter(player=player).exists() and not other_player:
				return Response({"message": "You are already in the queue"}, status=status.HTTP_400_BAD_REQUEST)
			if not MatchmakingQueue.objects.filter(player=player).exists():
				MatchmakingQueue.objects.create(player=player, systemID=systemID)
			if other_player:
				if(other_player.systemID == systemID):
					same_system = True
				else:
					same_system = False
				game_session = GameSession.objects.create(
					player1=other_player.player, player2=player
				)
				user2 = CustomUser.objects.get(username = other_player.player)
				MatchmakingQueue.objects.filter(player__in=[player, other_player.player]).delete()
				notify_match(user1, user2, game_session.id, same_system)
				return Response(
					{
						"message": "Match found!",
						"game_session_id": game_session.id
					}, status=status.HTTP_200_OK
				)
			return Response({"message": "Waiting for a match..."}, status=status.HTTP_200_OK)
	elif request.method=="DELETE":
		MatchmakingQueue.objects.filter(player=request.user).delete()
		return Response({"message": "Successfully deleted!"}, status=status.HTTP_204_NO_CONTENT)
