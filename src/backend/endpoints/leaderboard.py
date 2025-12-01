# src/backend/endpoints/leaderboard.py
from flask import Blueprint, jsonify
import sqlite3
import os

leaderboard_bp = Blueprint("leaderboard_bp", __name__, url_prefix="/leaderboard")

def get_db_connection():
    db_path = os.path.join(os.getcwd(), "heardle.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@leaderboard_bp.route("", methods=["GET"])
def get_leaderboard():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 
            P.gametag          AS name,   
            S.total_games,
            S.wins,
            S.cumulative_score AS score
        FROM Stats AS S
        JOIN Profile AS P
            ON S.U_ID = P.U_ID
        ORDER BY
            S.cumulative_score DESC,
            CASE 
                WHEN S.total_games > 0 
                THEN CAST(S.wins AS REAL) / S.total_games
                ELSE 0.0
            END DESC,
            P.gametag ASC
    """)

    rows = cur.fetchall()
    conn.close()

    leaderboard = []
    for rank, row in enumerate(rows, start=1):
        total_games = row["total_games"] or 0
        wins        = row["wins"] or 0
        score       = row["score"] or 0

        win_rate = wins / total_games if total_games > 0 else 0.0

        leaderboard.append({
            "rank": rank,           
            "name": row["name"],    
            "score": score,        
            "win_rate": win_rate,   
        })

    return jsonify(leaderboard)
