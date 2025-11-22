from flask import Flask
from dotenv import load_dotenv
import os
from app.endpoints.auth import auth_bp
from app.endpoints.test import test_bp

def create_app():
    app = Flask(__name__)

    load_dotenv()

    # Secret Key
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    # Everyone add your blueprints here
    app.register_blueprint(auth_bp)
    app.register_blueprint(test_bp)

    return app