from flask import Blueprint, jsonify, request, Response, stream_with_context
from app.chat.services import ChatService

chat = Blueprint("chat", __name__)
chat_service = ChatService()


@chat.route("/message", methods=["POST"])
def send_message_stream():
    data = request.get_json()
    message = data.get("message")

    if not message:
        return jsonify({"error": "Message is required"}), 400

    async def process_stream():
        try:
            async for line in chat_service.stream_message(message):
                yield f"data: {line}\n\n"
        except Exception as e:
            yield f"data: ERROR: {str(e)}\n\n"

    return Response(
        stream_with_context(process_stream()),
        mimetype="text/event-stream",
    )


@chat.route("/health", methods=["GET"])
def health_check():
    """Simple health check for the chat service."""
    return jsonify({"status": "healthy", "service": "chat"}), 200
