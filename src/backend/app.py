from flask import Flask, request, jsonify
import sqlite3
import base64
import bcrypt

app = Flask(__name__)

@app.post("/register")
def createAccount():
    data = request.get_json()
    username = data.get("username")
    password_encoded = data.get("password")

    # Username or password not provided
    if not username or not password_encoded:
        return jsonify({"error": "Missing username or password fields"}), 400
    
    # Decoding
    password = base64.b64decode(password_encoded).decode("utf-8")

    # Hashing password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # Connecting to database
    db = sqlite3.connect("heardle.db")
    cur = db.cursor()

    # Populating table
    cur.execute("INSERT INTO users (username, password) VALUES (?, ?)",
                (username, hashed_password))
    
    # Commiting changes
    db.commit()

    return jsonify({"message": "Account created successfully"}), 201
    
    # Closing connection
    db.close()

if __name__ == "__main__":
    app.run(debug=True)
