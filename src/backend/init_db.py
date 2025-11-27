import sqlite3
import os

def init_db():
    """Create heardle.db and all required tables if they don't exist."""
    db_path = os.path.join(os.getcwd(), "heardle.db")
    
    # Check if database already exists
    db_exists = os.path.exists(db_path)
    
    db = sqlite3.connect(db_path)
    cur = db.cursor()
    
    # Create Users table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Users (
            U_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password BLOB NOT NULL
        )
    """)
    
    # Create Profile table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Profile (
            P_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            U_ID INTEGER NOT NULL UNIQUE,
            gametag TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            profile_picture TEXT,
            FOREIGN KEY (U_ID) REFERENCES Users(U_ID) ON DELETE CASCADE
        )
    """)
    
    # Create Stats table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Stats (
            S_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            U_ID INTEGER NOT NULL UNIQUE,
            total_games INTEGER DEFAULT 0,
            wins INTEGER DEFAULT 0,
            cumulative_score INTEGER DEFAULT 0,
            FOREIGN KEY (U_ID) REFERENCES Users(U_ID) ON DELETE CASCADE
        )
    """)
    
    db.commit()
    db.close()
    
    if db_exists:
        print(f"✓ Database already exists at {db_path}")
    else:
        print(f"✓ Database initialized at {db_path}")
        print("✓ Tables created: Users, Profile, Stats")

if __name__ == "__main__":
    init_db()
