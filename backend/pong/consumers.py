# Channel's version of views

from channels.generic.websocket import AsyncWebsocketConsumer
import json

class PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    # async def disconnect(self, close_code):
    #     print(f"Disconnected: {close_code}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        # print(f"Received message: {data}")

        await self.send(text_data=json.dumps({
            'message': 'Message received!'
        }))
