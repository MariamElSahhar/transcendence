# Channel's version of views

from channels.generic.websocket import AsyncJsonWebsocketConsumer
import asyncio
from channels.layers import get_channel_layer
from rest_framework_simplejwt.tokens import AccessToken
from remote_pong.models import  GameSession
from asgiref.sync import async_to_sync, sync_to_async
import json
from users.models import CustomUser

class PongConsumer(AsyncJsonWebsocketConsumer):
    active_games = {}
    async def connect(self):
        clientIP=self.scope["client"][0]
        # self.redis = await aioredis.from_url("redis://localhost")
        # self.channel_name = self.channel_name
        # if clientIP == '127.0.0.1':
        #     self.is_same_system = True  # Same system
        # else:
        #     self.is_same_system = False
        access_token=AccessToken(self.scope['cookies']['access_token'])
        self.username = await sync_to_async(CustomUser.objects.get)(id=access_token['user_id'])
        self.room_group_name = f"user_{self.username}"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        print("player was made!!!!!!!!!!!!")

    async def disconnect(self, close_code):
        # await self.redis.delete(f"user:{self.username}:channel")
        print(f"Disconnected: {close_code}")

    async def move(self, event):
        # print(f"Message received: {event}")
        await self.send(text_data=json.dumps({
            "message": "Move slab",
            "key":event["key"],
            "keytype":event["keytype"],
        }))

    async def ball(self, event):
        # print(f"Message received: {event}")
        await self.send(text_data=json.dumps({
            "message": "Move ball",
            "position":event["position"],
        }))

    async def update_positions(self, event):
        # print(f"Message received: {event}")
        await self.send(text_data=json.dumps({
            "message": "Update positions",
            "leftpaddle":event["leftpaddle"],
            "rightpaddle":event["rightpaddle"],
            "ball":event["ball"],
        }))
    async def start_round(self, event):
        # print("startround")
        round_number = event["round_number"]
        await self.send(text_data=json.dumps({
            "message": "startRound",
            "round": round_number,
            "index": event["index"]
        }))

    async def endgame(self, event):
        print("startround")
        await self.send(text_data=json.dumps({
            "message": "endgame",
            "index":event["index"]
        }))

    async def leave_match(self, event):
        await self.send(text_data=json.dumps({
            "message": "opponent_left",
        }))


    async def receive(self, text_data):
         # Log the raw input
        try:
            data = json.loads(text_data)  # Parse JSON
            # print(f"Parsed data: {data}")  # Log the parsed dictionary
            # print(data.get("action"))
            # print(f"Raw text_data: {text_data}")
            if data.get("type") == "match_end":
                channel_layer = get_channel_layer()
                gameSession = data.get("gameSession")
                index = data.get("index")
                await channel_layer.group_send(
                    f"game_session_{gameSession}",
                    {
                        "type": "endgame",
                        "index":index
                    }
                )
            if data.get("action") == "leavingMatch":
                channel_layer = get_channel_layer()
                gameSession = data.get("gameSession")
                await channel_layer.group_send(
                    f"game_session_{gameSession}",
                    {
                        "type": "leave_match"
                    }
                )
            if data.get("action") == "move":
                key = data.get("key")
                # players = data.get("players")
                playerSide = data.get("playerSide")
                gameSession = data.get("gameSession")
                type = data.get("type")
                # valid_keys = ["w", "s"] if playerSide == "left" else ["ArrowUp", "ArrowDown"]
                # if key not in valid_keys:
                #     print(f"Invalid move by on {playerSide}: {key}")
                #     return
                channel_layer = get_channel_layer()
                # for player in players:
                await channel_layer.group_send(
                    f"game_session_{gameSession}",
                    {
                        "type": "move",
                        "key": key,
                        "keytype":type
                    }
                )
            if data.get("type") == "ballPosition":
                position = data.get("position")
                gameSession = data.get("gameSession")
                # valid_keys = ["w", "s"] if playerSide == "left" else ["ArrowUp", "ArrowDown"]
                # if key not in valid_keys:
                #     print(f"Invalid move by on {playerSide}: {key}")
                #     return
                channel_layer = get_channel_layer()
                # for player in players:
                await channel_layer.group_send(
                    f"game_session_{gameSession}",
                    {
                        "type": "ball",
                        "position": position,
                    }
                )
            await self.send(text_data=json.dumps({
                'message': 'Message received!'
            }))
            if data.get("type") == "update_positions":
                leftpaddle=data.get("leftpaddle")
                rightpaddle=data.get("rightpaddle")
                ball=data.get("ballposition")
                channel_layer = get_channel_layer()
                gameSession = data.get("gameSession")
                await channel_layer.group_send(
                    f"game_session_{gameSession}",
                    {
                        "type": "update_positions",
                        "leftpaddle": leftpaddle,
                        "rightpaddle":rightpaddle,
                        "ball":ball
                    }
                )
            if data.get("action") == "ready":
                print(data,data.get("playerSide"))
                gameSession = data.get("gameSession")
                # game_object = await GameSession.objects.get(id=gameSession)

                if gameSession not in self.active_games:
                    # print("here")
                    self.active_games[gameSession] = {"ready_count": 0, "round_number": 1}

                self.active_games[gameSession]["ready_count"] += 1
                # print(self.active_games[gameSession]["ready_count"])
                if self.active_games[gameSession]["ready_count"] == 2:
                    round_number = self.active_games[gameSession]["round_number"]
                    # print(round_number, data.get("playerSide"))
                    playerSide=data.get("playerSide")
                    self.active_games[gameSession]["round_number"] +=1
                    self.active_games[gameSession]["ready_count"] = 0  # Reset for next round
                    await self.channel_layer.group_send(
                        f"game_session_{gameSession}",
                        {
                            "type": "start_round",
                            "round_number": round_number,
                            "index": playerSide,
                        }
                    )

        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")  # Debug JSON errors


        async def end_round(self, event):
            game_session = GameSession.objects.get(id=self.game_session_id)
            self.active_games[self.game_session_id]["round_number"] += 1

            if self.active_games[self.game_session_id]["round_number"] > 5:
                game_session.status = "completed"
                game_session.save()
                await self.channel_layer.group_send(
                    f"game_session_{self.game_session_id}",
                    {"type": "game_over"}
                )

        async def game_over(self, event):
            await self.send(text_data=json.dumps({"type": "gameOver"}))




        # print("THIS FOR KEY PRESS: ", text_data)

    async def match_found(self, event):
        # print(f"Message received: {event}")
        gamesession=event["game_session_id"]
        # print(gamesession)

        group_name = f"game_session_{gamesession}"
        await self.channel_layer.group_add(
            group_name,
            self.channel_name
        )
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
