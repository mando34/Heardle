# src/backend/endpoints/history.py
from flask import Blueprint, jsonify, request
import sqlite3
import os

history_bp = Blueprint("history_bp", __name__, url_prefix="/history")


def get_db_connection():
    db_path = os.path.join(os.getcwd(), "heardle.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


@history_bp.route("", methods=["GET"])
def get_history():
    """
    If uid is provided:
      GET /history?uid=<U_ID>  -> history for that user.
    If uid is missing:
      GET /history            -> empty list (no error).

    Response per item:
      {
        "mode":   difficulty,
        "title":  genre,
        "score":  cumulative_score from Stats,
        "result": result or "Pending"
      }
    """
    uid = request.args.get("uid", type=int)

    # No uid -> just return empty list so leaderboard page doesn't crash
    if uid is None:
        return jsonify([]), 200

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT
                H.difficulty,
                H.genre,
                H.result,
                S.cumulative_score AS score
            FROM History AS H
            JOIN Stats   AS S
              ON H.U_ID = S.U_ID
            WHERE H.U_ID = ?
            ORDER BY H.H_ID DESC
            """,
            (uid,),
        )

        rows = cur.fetchall()

    except sqlite3.OperationalError as e:
        # If the History table doesn't exist yet, just act like there's no history
        if "no such table: History" in str(e):
            print("History table missing, returning empty history list.")
            return jsonify([]), 200
        print("History query error:", repr(e))
        return jsonify([]), 200

    finally:
        try:
            conn.close()
        except Exception:
            pass

    history = []
    for row in rows:
        difficulty = row["difficulty"] or ""
        genre      = row["genre"] or ""
        score      = row["score"] or 0
        result     = row["result"] or "Pending"

        history.append(
            {
                "mode": difficulty,  
                "title": genre,      
                "score": score,
                "result": result,
            }
        )

    return jsonify(history)
