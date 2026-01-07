from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["websocket"])


class ConnectionManager:
    """Manages WebSocket connections for message updates."""

    def __init__(self):
        # Map of canvas_id -> list of connected WebSockets
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, message_id: str):
        await websocket.accept()
        if message_id not in self.active_connections:
            self.active_connections[message_id] = []
        self.active_connections[message_id].append(websocket)

    def disconnect(self, websocket: WebSocket, message_id: str):
        if message_id in self.active_connections:
            if websocket in self.active_connections[message_id]:
                self.active_connections[message_id].remove(websocket)
            if not self.active_connections[message_id]:
                del self.active_connections[message_id]

    async def send_to_canvas(self, message_id: str, message: dict):
        """Send message to all connections watching a specific canvas."""
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
        self, message_id: str, chunk: str, is_complete: bool = False
    ):
        """Stream a title chunk to all canvas connections."""
        await self.send_to_canvas(
            message_id,
            {
                "type": "message_chunk",
                "chunk": chunk,
                "is_complete": is_complete,
            },
        )


# Global connection manager instance
manager = ConnectionManager()


@router.websocket("/ws/message/{canvas_id}")
async def message_websocket(websocket: WebSocket, message_id: str):
    """WebSocket endpoint for real-time canvas updates."""
    await manager.connect(websocket, message_id)
    try:
        while True:
            # Keep connection alive, listen for any client messages
            _ = await websocket.receive_text()
            # Could handle client messages here if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket, message_id)
