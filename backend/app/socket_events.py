# backend/app/socket_events.py
import asyncio
from flask_socketio import Namespace, emit
from app.chat.services import ChatService

chat_service = ChatService()


class ChatNamespace(Namespace):
    def on_connect(self):
        print("Client connected")

    def on_disconnect(self):
        print("Client disconnected")

    def on_user_message(self, data):
        message = data.get("message")
        print(f"Received message from user: {message}")

        # Start async task to process message and stream logs
        asyncio.create_task(self.process_message_async(message))

    async def process_message_async(self, message):
        try:
            response_data = await chat_service.process_message(message)
            emit("final_response", {"response": response_data}, namespace="/chat")
        except Exception as e:
            emit("error", {"error": str(e)}, namespace="/chat")
