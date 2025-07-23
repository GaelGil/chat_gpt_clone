from .auth import auth
from .users import users
from .posts import posts
from .profile import profile

def register_routes(app):
    app.register_blueprint(auth)
    app.register_blueprint(users)
    app.register_blueprint(posts)
    app.register_blueprint(profile)
