import base64
import requests
import sqlite3
import os

API_BASE = "http://127.0.0.1:5000"

# Run this script from: C:\softwareC\Heardle
DB_PATH = os.path.join(os.getcwd(), "heardle.db")

EMAIL = "memayorga@miners.utep.edu"
PASSWORD = "password123"



# 1) REGISTER USER

def register_user():
    print("=== Register user (if not already registered) ===")
    url = f"{API_BASE}/register"

    encoded_pw = base64.b64encode(PASSWORD.encode("utf-8")).decode("utf-8")

    data = {"email": EMAIL, "password": encoded_pw}

    resp = requests.post(url, json=data)
    print("Register status:", resp.status_code)
    try:
        print("Register response:", resp.json())
    except Exception:
        print("Register raw response:", resp.text)



#  LOOK UP U_ID

def get_u_id():
    print("\n=== Look up U_ID from Users table ===")
    print("Using DB:", DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("SELECT U_ID FROM Users WHERE email = ?", (EMAIL,))
    row = cur.fetchone()
    conn.close()

    if not row:
        print(" No user found for email:", EMAIL)
        return None

    u_id = row[0]
    print(" Found U_ID:", u_id)
    return u_id



# 3) INSERT TEST STATS + HISTORY

def insert_test_data(u_id: int):
    print("\n=== Insert test Stats + History rows ===")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Make sure History table exists with the correct schema
    cur.execute("""
        CREATE TABLE IF NOT EXISTS History (
            H_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            U_ID INTEGER,
            difficulty TEXT,
            genre TEXT,
            result TEXT,
            FOREIGN KEY (U_ID) REFERENCES Users(U_ID) ON DELETE CASCADE
        )
    """)

    # Clean old data for this user
    cur.execute("DELETE FROM Stats   WHERE U_ID = ?", (u_id,))
    cur.execute("DELETE FROM History WHERE U_ID = ?", (u_id,))

    # Stats row (only one allowed per U_ID by schema)
    cur.execute("""
        INSERT INTO Stats (U_ID, total_games, wins, cumulative_score)
        VALUES (?, ?, ?, ?)
    """, (u_id, 10, 7, 4200))

    # History rows for that U_ID
    test_history = [
        (u_id, "Easy",   "J-Pop", "Win"),
        (u_id, "Hard",   "Indie", "Loss"),
        (u_id, "Medium", "Rock",  "Win"),
    ]

    cur.executemany("""
        INSERT INTO History (U_ID, difficulty, genre, result)
        VALUES (?, ?, ?, ?)
    """, test_history)

    conn.commit()
    conn.close()
    print(" Inserted Stats + History rows for U_ID", u_id)



def fetch_history(u_id):
    print("\n=== Call /history endpoint ===")
    url = f"{API_BASE}/history?uid={u_id}"
    resp = requests.get(url)
    print("History status:", resp.status_code)

    try:
        data = resp.json()
        print("History JSON:")
        for item in data:
            print(item)
    except Exception:
        print("History raw response:", resp.text)



if __name__ == "__main__":
    # 1) Ensure user exists
    register_user()

    # 2) Get U_ID for test user
    u_id = get_u_id()
    if u_id is None:
        print("Cannot continue without U_ID.")
        exit(1)

    # 3) Insert sample Stats + History
    insert_test_data(u_id)

    # 4) Fetch history via API
    fetch_history(u_id)
