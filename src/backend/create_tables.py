import sqlite3

DB_NAME = "heardle.db"

# run this file in the terminal to create heardle.db with the necessary tables.


# added these tables for testing purposes; can be modified later
# implementations based on the provided screenshot in teams channel.

def create_tables():
    db = sqlite3.connect(DB_NAME)
    cur = db.cursor()

    # creates user table if it does not exist
    cur.execute("""
    CREATE TABLE IF NOT EXISTS Users (
        U_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Username TEXT NOT NULL UNIQUE,
        Password TEXT NOT NULL
    );
    """)

    # creates profile table if it does not exist
    cur.execute("""
    CREATE TABLE IF NOT EXISTS Profile (
        P_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        U_ID INTEGER NOT NULL,
        Gamertag TEXT UNIQUE,
        FirstName TEXT,
        LastName TEXT,
        Profile_Picture TEXT,
        FOREIGN KEY (U_ID) REFERENCES Users(U_ID)
    );
    """)

    # creates stats table if it does not exist
    cur.execute("""
    CREATE TABLE IF NOT EXISTS Stats (
        S_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        U_ID INTEGER NOT NULL,
        TotalGames INTEGER DEFAULT 0,
        Wins INTEGER DEFAULT 0,
        CumulativeScore INTEGER DEFAULT 0,
        FOREIGN KEY (U_ID) REFERENCES Users(U_ID)
    );
    """)

    db.commit()
    db.close()
    print("All tables created.")

if __name__ == "__main__":
    create_tables()