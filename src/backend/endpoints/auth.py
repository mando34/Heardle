from flask import Blueprint, request, jsonify
import sqlite3
import base64
import bcrypt
import jwt
import datetime
from flask import current_app
import os

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def createAccount():

    # Getting request
    data = request.get_json()

    # Getting fields
    email = data.get("email")
    encoded_password = data.get("password")

    # Validating required fields
    if not email and not encoded_password:
        return jsonify({"error": "Missing email and password"}), 400
    
    if not email:
        return jsonify({"error": "Missing email"}), 400
    
    if not encoded_password:
        return jsonify({"error": "Missing password"}), 400
    
    # Decoding password
    try:
        password = base64.b64decode(encoded_password).decode("utf-8")
    except Exception:
        return jsonify({"error": "Unable to decode password"}), 400

    # Checking password strength
    if len(password) <= 7:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400

    # Hashing password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        
    # Connecting to database
    db_path = os.path.join(os.getcwd(), "heardle.db")
    db = sqlite3.connect(db_path)
    cur = db.cursor()

    # Check if user already exists
    cur.execute("SELECT 1 FROM Users WHERE email = ?", (email,))
    if cur.fetchone():
        db.close()
        return jsonify({"error": "Account with this email already exists"}), 409

    # Populating table
    try:
        cur.execute("INSERT INTO Users (email, password) VALUES (?, ?)",
                    (email, hashed_password))
        
        user_id = cur.lastrowid

        # Creating Profile
        cur.execute(
            """
            INSERT INTO PROFILE (U_ID, gametag, first_name, last_name, profile_picture)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, "headless_user", "", "", "")
        )

        # Creating Stats
        cur.execute(
            """
            INSERT INTO Stats (U_ID, total_games, wins, cumulative_score)
            VALUES (?, ?, ?, ?)
            """,
            (user_id, 0, 0, 0)
        )

        # Commiting Changes
        db.commit()
    except sqlite3.Error as e:
        db.close()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Closing connection
    db.close()

    return jsonify({"message": "Account created successfully"}), 201

@auth_bp.post("/login")
def login():

    # Getting request
    data = request.get_json()

    # Getting fields
    email = data.get("email")
    encoded_password = data.get("password")

    # Connecting to database
    db_path = os.path.join(os.getcwd(), "heardle.db")
    db = sqlite3.connect(db_path)
    cur = db.cursor()

    # Check if credentials match

    # Check if email exists and getting User data
    cur.execute("SELECT U_ID, password FROM Users WHERE email = ?", (email,))
    row = cur.fetchone()

    # Email does not exist
    if not row:
        db.close()
        return jsonify({"error": "Username or password is incorrect"}), 401

    # Getting user_id and hashed password
    user_id = row[0]
    hashed_password = row[1]

    # Decoding password
    try:
        password = base64.b64decode(encoded_password).decode("utf-8")
    except Exception:
        db.close()
        return jsonify({"error": "Unable to decode password"}), 400
    
    # Check if password matches
    if not bcrypt.checkpw(password.encode("utf-8"), hashed_password):
        db.close()
        return jsonify({"error": "Username or password is incorrect"}), 401
    
    # JWT Token
    token = jwt.encode({
        "user_id": user_id,
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
}, current_app.config["SECRET_KEY"], algorithm="HS256")

    # Close database
    db.close()

    # Login Success
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user_id": user_id,
        "email": email
    }), 200

@auth_bp.post("/logout")
def logout():
    """
    Logout endpoint. Frontend can call this to invalidate the session on the server.
    The token stored in localStorage will be automatically cleared by the frontend.
    """
    return jsonify({"message": "Logged out successfully"}), 200

@auth_bp.get("/getProfile")
def get_profile():

    # Use user ID given from page
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    # Connect to database file
    db_path = os.path.join(os.getcwd(), "heardle.db")
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    cur = db.cursor()

    # Join and return all 3 tables:
    cur.execute("""
        SELECT 
            Users.U_ID,
            Users.email,
            Profile.gametag,
            Profile.first_name,
            Profile.last_name,
            Profile.profile_picture,
            Stats.total_games,
            Stats.wins,
            Stats.cumulative_score
        FROM Users
        LEFT JOIN Profile ON Users.U_ID = Profile.U_ID
        LEFT JOIN Stats ON Users.U_ID = Stats.U_ID
        WHERE Users.U_ID = ?
    """, (user_id,))

    row = cur.fetchone()
    db.close()

    if not row:
        return jsonify({"error": "User not found"}), 404

    return jsonify(dict(row))

@auth_bp.post("/setProfile")
def set_profile():

    data = request.get_json()

    # Use user ID given from page
    user_id = request.args.get("user_id")

    # Extract values from request
    gametag = data.get("gametag")
    first_name = data.get("first_name")
    last_name = data.get("last_name")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    # Connect to database file
    db_path = os.path.join(os.getcwd(), "heardle.db")
    db = sqlite3.connect(db_path)
    cur = db.cursor()

    # Update Profile
    try:
        cur.execute("""
            UPDATE Profile
            SET gametag = ?, first_name = ?, last_name = ?
            WHERE U_ID = ?
        """, (gametag, first_name, last_name, user_id))

        db.commit()
    except sqlite3.Error as e:
        db.close()
        return jsonify({"error": str(e)}), 500

    db.close()
    return jsonify({"message": f"Profile ID {user_id} updated successfully"}), 200