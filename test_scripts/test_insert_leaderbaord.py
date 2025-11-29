import sqlite3
import os

db_path = os.path.join(os.getcwd(), "heardle.db")
print("Using DB:", db_path)

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Helper to insert a user+profile+stats in one go
def add_player(email, gametag, total_games, wins, cumulative_score):
    # 1) Insert user
    cur.execute(
        "INSERT INTO Users (email, password) VALUES (?, X'00')",
        (email,),
    )
    u_id = cur.lastrowid   # <-- whatever U_ID SQLite chose

    # 2) Insert profile for that user
    cur.execute("""
        INSERT INTO Profile (U_ID, gametag, first_name, last_name, profile_picture)
        VALUES (?, ?, NULL, NULL, NULL)
    """, (u_id, gametag))

    # 3) Insert stats for that user
    cur.execute("""
        INSERT INTO Stats (U_ID, total_games, wins, cumulative_score)
        VALUES (?, ?, ?, ?)
    """, (u_id, total_games, wins, cumulative_score))


# Cristobal – top score
add_player(
    email="cris@example.com",
    gametag="Cristobal",
    total_games=20,
    wins=15,
    cumulative_score=15500,
)

# Piccolo
add_player(
    email="piccolo@example.com",
    gametag="Piccolo",
    total_games=10,
    wins=5,
    cumulative_score=6700,
)

# David
add_player(
    email="david@example.com",
    gametag="David",
    total_games=8,
    wins=4,
    cumulative_score=6700,
)

conn.commit()
conn.close()
print("Seed data inserted.")
