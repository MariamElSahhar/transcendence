# Channel's version of views

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
from rest_framework_simplejwt.tokens import AccessToken
from asgiref.sync import async_to_sync, sync_to_async
import json
from users.models import CustomUser

class PongConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        clientIP=self.scope["client"][0]
        if clientIP == '127.0.0.1':
            self.is_same_system = True  # Same system
        else:
            self.is_same_system = False
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

    async def move(self, event):
        print(f"Message received: {event}")
        await self.send(text_data=json.dumps({
            "message": "Move slab",
            "key":event["key"],
        }))


    async def receive(self, text_data):
        print(f"Raw text_data: {text_data}")  # Log the raw input
        try:
            data = json.loads(text_data)  # Parse JSON
            print(f"Parsed data: {data}")  # Log the parsed dictionary
            # print(data.get("action"))
            if data.get("action") == "move":
                key = data.get("key")
                players = data.get("players")
                playerSide = data.get("playerSide")
                # valid_keys = ["w", "s"] if playerSide == "left" else ["ArrowUp", "ArrowDown"]
                # if key not in valid_keys:
                #     print(f"Invalid move by on {playerSide}: {key}")
                #     return
                channel_layer = get_channel_layer()
                for player in players:
                    await channel_layer.group_send(
                        f"user_{player}",
                        {
                            "type": "move",
                            "key": key,
                        }
                    )
            await self.send(text_data=json.dumps({
                'message': 'Message received!'
            }))
                # print(players[0],players[1],players)
            # for key in {data}:
            #     print(data[key])
            # if isinstance(data, dict):  # Check if data is a dictionary
            #     if data.get("action") == "move":
            #         players = data.get("players")
            #         key = data.get("key")
            #         print(f"Action: move, Players: {players}, Key: {key}")  # Debug

                    # Broadcast to both players
                    # await self.channel_layer.group_send(
                    #     self.room_group_name,
                    #     {
                    #         "type": "player_move",
                    #         "key": key,
                    #         "players": players,
                    #     },
                    # )
            # else:
            #     print("Received data is not a valid dictionary.")
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")  # Debug JSON errors




        # print("THIS FOR KEY PRESS: ", text_data)

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