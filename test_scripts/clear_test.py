import sqlite3
import os

# Run this script from: C:\softwareC\Heardle
DB_PATH = os.path.join(os.getcwd(), "heardle.db")

def clear_all_tables():
    print("=== CLEARING ALL TABLES IN heardle.db ===")
    print("DB Path:", DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Disable foreign key checks so deletes won't fail
    cur.execute("PRAGMA foreign_keys = OFF;")

    tables = ["History", "Stats", "Profile", "Users"]

    for table in tables:
        try:
            cur.execute(f"DELETE FROM {table};")
            print(f" Cleared {table}")
        except Exception as e:
            print(f" Failed to clear {table}:", e)

    conn.commit()

    # Re-enable FK checks
    cur.execute("PRAGMA foreign_keys = ON;")
    conn.close()

    print("=== DONE. All tables are empty. ===")


if __name__ == "__main__":
    clear_all_tables()
