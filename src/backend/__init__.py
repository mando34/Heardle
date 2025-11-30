from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from src.backend.endpoints.auth import auth_bp
from src.backend.endpoints.test import test_bp
from src.backend.endpoints.spotify import spotify_bp
from src.backend.endpoints.game import game_bp

def create_app():
    app = Flask(__name__)

    load_dotenv()

    # Secret Key
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.secret_key = os.getenv("FLASK_SECRET_KEY")

    # Enable CORS for the frontend during development
    frontend_origin = os.getenv("FRONTEND_APP_URL", "http://localhost:5173")
    CORS(app, origins=[frontend_origin], supports_credentials=True)

    # Everyone add your blueprints here
    app.register_blueprint(auth_bp)
    app.register_blueprint(test_bp)
    app.register_blueprint(spotify_bp)
    app.register_blueprint(game_bp)

    return app