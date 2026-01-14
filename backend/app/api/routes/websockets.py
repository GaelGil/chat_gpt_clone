import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws", tags=["websocket"])


class ConnectionManager:
    """Manages WebSocket connections for message updates."""

    def __init__(self):
        # Map of message_id -> list of connected WebSockets
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, message_id: str):
        """
        Add a WebSocket connection to the manager.
        """

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
        msg_type: str = "message_chunk",
    ):
        """Stream a response chunk to message connections.

        Args:
            message_id (str): Message ID
            chunk (str): Response chunk
            is_complete (bool, optional): Whether the response is complete. Defaults to False.
            msg_type (str, optional): Message type. Defaults to "message_chunk".
        """
        await self.send_to_message(
            message_id=message_id,
            message={
                "type": msg_type,
                "chunk": chunk,
                "is_complete": is_complete,
            },
        )


# Global connection manager instance
manager = ConnectionManager()


@router.websocket("/message/{message_id}")
async def message_websocket(websocket: WebSocket, message_id: str):
    """WebSocket endpoint for real-time canvas updates."""
    await manager.connect(websocket, message_id)
    try:
        while True:
            # Keep connection alive, listen for any client messages
            # _ = await websocket.receive_text()
            try:
                await asyncio.wait_for(websocket.receive_text(), timeout=30)
            except asyncio.TimeoutError:
                pass
            # Could handle client messages here if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket, message_id)
