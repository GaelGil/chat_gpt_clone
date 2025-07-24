# from .auth import auth
from .routes.essay_writer import essay_writer
from .routes.agents import agents


def register_routes(app):
    app.register_blueprint(essay_writer)
    app.register_blueprint(agents)
