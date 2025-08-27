from functools import wraps
from flask import session, redirect, url_for
from app.chat.services import ChatService


def chat_service_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return redirect(url_for("auth.login"))
        # get chat session id
        chat_session_id = session.get("chat_session_id")
        # start chat service with user id and session id
        chat_service = ChatService(user_id=user_id, session_id=chat_session_id)
        # Store session_id in Flask session for future requests
        session["chat_session_id"] = chat_service.session_id

        return func(chat_service, *args, **kwargs)

    return wrapper
