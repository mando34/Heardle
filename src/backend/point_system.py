import sqlite3

DB_NAME = "heardle.db"

class PointSystem:
    def __init__(self, db_path=DB_NAME):
        self.db_path = db_path

    # Helper to connect to DB
    def _connect(self):
        return sqlite3.connect(self.db_path)

    # Ensure user has a Stats row
    def _ensure_user_stats(self, user_id):
        db = self._connect()
        cur = db.cursor()

        cur.execute("SELECT * FROM Stats WHERE U_ID = ?", (user_id,))
        row = cur.fetchone()

        if row is None:
            cur.execute("""
                INSERT INTO Stats (U_ID, TotalGames, Wins, CumulativeScore)
                VALUES (?, 0, 0, 0)
            """, (user_id,))
            db.commit()

        db.close()

    # gets the current points of a user
    def get_points(self, user_id):
        self._ensure_user_stats(user_id)

        db = self._connect()
        cur = db.cursor()

        cur.execute("SELECT CumulativeScore FROM Stats WHERE U_ID = ?", (user_id,))
        row = cur.fetchone()

        db.close()

        return row[0] if row else 0

    # adds points to a user's cumulative score
    def add_points(self, user_id, amount):
        self._ensure_user_stats(user_id)

        db = self._connect()
        cur = db.cursor()

        # Update cumulative score
        cur.execute("""
            UPDATE Stats
            SET CumulativeScore = CumulativeScore + ?
            WHERE U_ID = ?
        """, (amount, user_id))

        db.commit()
        db.close()

        return self.get_points(user_id)