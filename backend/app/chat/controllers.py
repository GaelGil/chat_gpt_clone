from flask import Blueprint, jsonify, request, stream_with_context, Response, session
from app.chat.services import ChatService
from app.chat.models import ChatSession
from app.user.models import User
from app.extensions import db
from app.chat.decorators import chat_service_required
from app.auth.decorators import login_required
import sys
import json
import logging

logger = logging.getLogger(__name__)

chat = Blueprint("chat", __name__)


@chat_service_required
def generate_response(chat_service: ChatService, message: str):
    try:
        for chunk in chat_service.process_message_stream(message):
            if isinstance(chunk, str):
                yield f"data: {chunk}\n\n"
                sys.stdout.flush()
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'text': str(e)})}\n\n"


@chat.route("/message/stream", methods=["POST"])
@login_required
def send_message_stream():
    """Send a message to the AI agent and get a streaming SSE response."""
    print("send_message_stream called")
    try:
        data = request.get_json()
        message = data.get("message")
        chat_id = data.get("chatId")

        chat = ChatSession.query.get(chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404
        session["chat_session_id"] = chat_id

        if not message:
            return jsonify({"error": "Message is required"}), 400

        return Response(
            stream_with_context(generate_response(message)),
            content_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        )
    except Exception as e:
        return jsonify({"error": f"Failed to process message: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Failed to process message: {str(e)}"}), 500


@chat.route("/health", methods=["GET"])
@login_required
def health_check():
    """Simple health check for the chat service."""
    return jsonify({"status": "healthy", "service": "chat"}), 200


@chat.route("/users/<int:user_id>/chats", methods=["GET"])
@login_required
def get_chats(user_id):
    user_session_id = session.get("user_id")
    if user_session_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 401
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    chats = ChatSession.query.filter_by(user_id=user_id).all()

    chats_data = [{"id": chat.id, "name": chat.name} for chat in chats]

    return jsonify(chats_data), 200


@chat.route("/delete", methods=["DELETE"])
@login_required
def delete_chat():
    try:
        data = request.get_json()
        chat_id = data.get("id")

        chat = ChatSession.query.get(chat_id)
        if not chat:
            return jsonify({"msg": "Chat not found"}), 404

        db.session.delete(chat)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": f"Failed to delete chat: {str(e)}"}), 500

    return jsonify({"msg": "Chat deleted successfully"}), 200


@chat.route("/craete", methods=["POST"])
@login_required
def create_chat():
    try:
        data = request.get_json()
        name = data.get("name")

        chat = ChatSession(name=name, user_id=session.get("user_id"))
        db.session.add(chat)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": f"Failed to create chat: {str(e)}"}), 500

    return jsonify({"id": chat.id, "name": chat.name}), 201


@chat.route("/users/<int:chat_id>/get", methods=["GET"])
@login_required
def get_chat(chat_id):
    try:
        chat = ChatSession.query.get(chat_id)
        if not chat:
            return jsonify({"msg": "Chat not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to get chat: {str(e)}"}), 500

    return jsonify(chat.to_dict()), 200
