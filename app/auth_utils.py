from flask import request, jsonify, current_app
from functools import wraps
import jwt

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):

        # Get token from Authorization header
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"error": "Missing Authorization header"}), 401

        # Expect header format: Bearer <token>
        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Invalid Authorization header format"}), 401

        token = parts[1]

        try:
            # Decode token
            decoded = jwt.decode(
                token,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )

            # Attach user_id to the request object
            request.user_id = decoded["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        # Continue to the protected function
        return f(*args, **kwargs)
    return wrapper
