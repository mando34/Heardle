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

@history_bp.route("", methods=["POST"])
def add_history():
    """
    Record the result of a completed game and update Stats.

    Expected JSON body:
      {
        "difficulty": "Normal",
        "genre": "Mixed",
        "result": "win" | "lose",
        "score_delta": 300   # points earned this round
      }

    In a real app, U_ID should come from authentication (e.g., JWT).
    For now, you can:
      - use a fixed U_ID for testing, or
      - extend this to read from auth_utils.require_auth
    """
    data = request.get_json(force=True) or {}

    difficulty  = data.get("difficulty") or ""
    genre       = data.get("genre") or ""
    result      = data.get("result")    # "win" or "lose"
    score_delta = data.get("score_delta", 0)

    if result not in ("win", "lose"):
        return jsonify({"error": "result must be 'win' or 'lose'"}), 400

    # TODO: in a real implementation, derive U_ID from auth token.
    # For now you can hard-code or pass it from frontend if needed.
    uid = data.get("uid", 1)  # ⚠️ TEMP: default to user 1

    conn = get_db_connection()
    cur  = conn.cursor()

    try:
        # Insert into History
        cur.execute(
            """
            INSERT INTO History (U_ID, difficulty, genre, result)
            VALUES (?, ?, ?, ?)
            """,
            (uid, difficulty, genre, result),
        )

        # Update Stats (or insert if missing)
        cur.execute(
            """
            SELECT total_games, wins, cumulative_score
            FROM Stats
            WHERE U_ID = ?
            """,
            (uid,),
        )
        row = cur.fetchone()

        if row:
            total_games = (row["total_games"] or 0) + 1
            wins        = (row["wins"] or 0) + (1 if result == "win" else 0)
            cumulative  = (row["cumulative_score"] or 0) + score_delta

            cur.execute(
                """
                UPDATE Stats
                SET total_games = ?, wins = ?, cumulative_score = ?
                WHERE U_ID = ?
                """,
                (total_games, wins, cumulative, uid),
            )
        else:
            # No stats row yet, create one
            cur.execute(
                """
                INSERT INTO Stats (U_ID, total_games, wins, cumulative_score)
                VALUES (?, ?, ?, ?)
                """,
                (uid, 1, 1 if result == "win" else 0, score_delta),
            )

        conn.commit()

    except sqlite3.OperationalError as e:
        print("History insert/update error:", repr(e))
        conn.rollback()
        return jsonify({"error": "Database error while recording history"}), 500

    finally:
        conn.close()

    return jsonify({"ok": True}), 201



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
