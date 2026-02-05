from fastapi import WebSocket

from app.database.schemas.Message import ResponseType


class ConnectionManager:
    """Manages WebSocket connections for message updates."""

    def __init__(self):
        # Map of message_id -> list of connected WebSockets
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, message_id: str):
        """
        Add a WebSocket connection to the manager.
        """
        print("NEW WS CONNECTED FOR", message_id)
        # Accept the connection
        await websocket.accept()
        # Check if message_id is in active_connections
        if message_id not in self.active_connections:
            # If not, add it with an empty list
            self.active_connections[message_id] = []
        # If message_id is in active_connections, add the new connection
        self.active_connections[message_id].append(websocket)

    def disconnect(self, websocket: WebSocket, message_id: str):
        if message_id in self.active_connections:
            if websocket in self.active_connections[message_id]:
                self.active_connections[message_id].remove(websocket)
            if not self.active_connections[message_id]:
                del self.active_connections[message_id]

    async def send_to_message(self, message_id: str, message: dict):
        """Send message to all connections watching a specific message.

        Args:
            message_id (str): Message ID
            message (dict): Message

        """
        if message_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[message_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    disconnected.append(connection)
            # Clean up disconnected
            for conn in disconnected:
                self.disconnect(conn, message_id)

    async def stream_response_chunk(
        self,
        message_id: str,
        chunk: str,
        is_complete: bool = False,
        msg_type: ResponseType = ResponseType.MESSAGE_CHUNK,
    ):
        """Stream a response chunk to message connections.

        Args:
            message_id (str): Message ID
            chunk (str): Response chunk
            is_complete (bool, optional): Whether the response is complete. Defaults to False.
            msg_type (str, optional): Message type. Defaults to "message_chunk".
        """
        print(f"STREAM RESPONSE CHUNK CALLED {chunk} for message_id: {message_id}")
        await self.send_to_message(
            message_id=message_id,
            message={
                "type": msg_type,
                "chunk": chunk,
                "is_complete": is_complete,
            },
        )
