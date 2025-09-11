import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "fallback-uri")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Sessions / Security
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
    SESSION_COOKIE_NAME = "session"
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = False  # set to True in production

    # App / Server
    DEBUG = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
    PORT = int(os.environ.get("FLASK_PORT", 5000))

    # Frontend / CORS
    FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", FRONTEND_URL).split(
        ","
    )
