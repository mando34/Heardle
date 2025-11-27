from flask import Blueprint, jsonify, request
from src.backend.auth_utils import require_auth

test_bp = Blueprint("test", __name__)

@test_bp.get("/secret")
@require_auth
def secret():
    return jsonify({
        "message": "You accessed the endpoint.",
        "your_user_id": request.user_id
    }), 200
