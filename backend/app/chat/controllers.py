from flask import Blueprint, jsonify, request, stream_with_context, Response, session
from app.chat.services import ChatService
from app.chat.models import ChatSession
from app.user.models import User
from app.extensions import db
from app.auth.decorators import login_required
import sys
import json
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)
chat = Blueprint("chat", __name__)


def default_chat_name():
    return f"Chat {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}"


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
    try:
        data = request.get_json()
        message = data.get("message")
        chat_id = data.get("chatId")

        # check empty message
        if not message:
            return jsonify({"error": "Message is required"}), 400

        # create new chat session if id not provided
        if not chat_id:
            chat_session = ChatSession(
                user_id=session["user_id"], name=default_chat_name()
            )
            db.session.add(chat_session)
            db.session.commit()
            chat_id = chat_session.id

        # check chat session exists
        chat_session = db.session.get(ChatSession, chat_id)
        if not chat_session:
            return jsonify({"error": "Chat not found"}), 404

        # check user is authorized
        user = db.session.get(User, session["user_id"])
        if chat_session.user_id != user.id:
            return jsonify({"error": "Unauthorized"}), 403

        # start chat service
        chat_service = ChatService(user_id=session["user_id"], session_id=chat_id)

        # Store session_id in Flask session for future requests
        session["chat_session_id"] = chat_id

        return Response(
            stream_with_context(generate_response(chat_service, message)),
            content_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        )
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
    # check user is authorized
    user_session_id = session.get("user_id")
    if user_session_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    # get user from id
    user = db.session.get(User, user_id)
    # check user exists
    if not user:
        return jsonify({"msg": "User not found"}), 404
    # get users chats
    chats = ChatSession.query.filter_by(user_id=user_id).all()
    chats_data = [{"id": chat.id, "name": chat.name} for chat in chats]
    return jsonify(chats_data), 200


@chat.route("/delete", methods=["DELETE"])
@login_required
def delete_chat():
    try:
        # get data from request
        data = request.get_json()
        chat_id = data.get("id")
        # get chat using id
        chat = db.session.get(ChatSession, chat_id)

        # check chat exists
        if not chat:
            return jsonify({"msg": "Chat not found"}), 404

        # check user is authorized
        if not (chat.user_id == session["user_id"]):
            return jsonify({"msg": "Unauthorized"}), 403

        db.session.delete(chat)
        db.session.commit()
    except Exception as e:
        logger.exception("Failed to delete chat")
        return jsonify({"error": f"Failed to delete chat: {str(e)}"}), 500

    return jsonify({"msg": "Chat deleted successfully"}), 200


@chat.route("/create", methods=["POST"])
@login_required
def create_chat():
    try:
        # get data from request
        data = request.get_json()
        name = data.get("name")
        # create chat
        chat = ChatSession(name=name, user_id=session.get("user_id"))
        # add chat to db
        db.session.add(chat)
        # commit changes
        db.session.commit()
    except Exception as e:
        logger.exception("Failed to delete chat")
        return jsonify({"error": f"Failed to create chat: {str(e)}"}), 500
    return jsonify({"id": chat.id, "name": chat.name}), 201


@chat.route("/users/<int:chat_id>/get", methods=["GET"])
@login_required
def get_chat(chat_id):
    try:
        # check user is authorized
        user_session_id = session.get("user_id")
        chat = db.session.get(ChatSession, chat_id)
        chat_user = chat.user_id
        if user_session_id != chat_user:
            return jsonify({"msg": "Unauthorized"}), 403
        if not chat:
            return jsonify({"msg": "Chat not found"}), 404
    except Exception as e:
        logger.exception("Failed to delete chat")
        return jsonify({"error": f"Failed to get chat: {str(e)}"}), 500
    return jsonify(chat.to_dict()), 200
