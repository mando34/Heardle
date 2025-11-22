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
        
        # Commiting changes
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
        "token": token
    }), 200