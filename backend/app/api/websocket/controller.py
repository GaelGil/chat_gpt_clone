from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.api.websocket.ConnectionManager import ConnectionManager

router = APIRouter(prefix="/ws", tags=["websocket"])


# Global connection manager instance
manager = ConnectionManager()


@router.websocket("/message/{message_id}")
async def message_websocket(websocket: WebSocket, message_id: str):
    await manager.connect(websocket, message_id)
    try:
        while True:
            # Keep connection alive, listen for any client messages
            _ = await websocket.receive_text()
            # Could handle client messages here if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket, message_id)
