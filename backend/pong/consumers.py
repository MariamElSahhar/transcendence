# Channel's version of views

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
from rest_framework_simplejwt.tokens import AccessToken
from asgiref.sync import async_to_sync, sync_to_async
import json
from users.models import CustomUser

class PongConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        access_token=AccessToken(self.scope['cookies']['access_token'])
        username = await sync_to_async(CustomUser.objects.get)(id=access_token['user_id'])
        self.room_group_name = f"user_{username}"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        print(f"Disconnected: {close_code}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.send(text_data=json.dumps({
            'message': 'Message received!'
        }))

    async def match_found(self, event):
        print(f"Message received: {event}")
        await self.send(text_data=json.dumps({
            "message": "Match found!",
            "game_session_id": event["game_session_id"],
            "position":event["position"],
            "player":  event["player"],
            "avatar": event["avatar"]
        }))



def notify_match(player1, player2, game_session):
    group_name = f"game_session_{game_session}"
    channel_layer = get_channel_layer()
    print("CHANELS", channel_layer)
    print("MATCH FOUND: ", group_name, player1.username, player2.username)
    async_to_sync(channel_layer.group_send)(
        f"user_{player1.username}",
        {
            "type": "match_found",
            "game_session_id": game_session,
            "position":"left",
            "player": player2.username,
            "avatar": player2.avatar.url,
        }
    )
    async_to_sync(channel_layer.group_send)(
        f"user_{player2.username}",
        {
            "type": "match_found",
            "game_session_id": game_session,
    		"position":"right",
            "player": player1.username,
            "avatar": player1.avatar.url,
        }
    )