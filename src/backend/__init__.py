from flask import Flask
from dotenv import load_dotenv
import os
from src.backend.endpoints.auth import auth_bp
from src.backend.endpoints.test import test_bp
from src.backend.endpoints.spotify import spotify_bp

def create_app():
    app = Flask(__name__)

    load_dotenv()

    # Secret Key
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.secret_key = os.getenv("FLASK_SECRET_KEY")

    # Everyone add your blueprints here
    app.register_blueprint(auth_bp)
    app.register_blueprint(test_bp)
    app.register_blueprint(spotify_bp)

    return app