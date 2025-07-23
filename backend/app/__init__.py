from flask import Flask
from app.config import Config
from app.extensions import db, bcrypt, jwt, migrate, socketio, blacklist
from app.routes import register_routes
from flask_cors import CORS
from flask import jsonify
from flask_jwt_extended import JWTManager

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in blacklist


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    with app.app_context():
        from app.models import user, post


    register_routes(app)
    return app