import sqlite3

def get_connection():
    conn = sqlite3.connect('f1.db')
    conn.row_factory = sqlite3.Row  # lets you access columns by name
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Races table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS races (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            year INTEGER,
            round INTEGER,
            race_name TEXT,
            circuit TEXT,
            country TEXT,
            date TEXT
        )
    ''')

    # Results table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            race_id INTEGER,
            position INTEGER,
            driver_name TEXT,
            driver_code TEXT,
            team_name TEXT,
            points REAL,
            status TEXT,
            laps INTEGER,
            FOREIGN KEY (race_id) REFERENCES races(id)
        )
    ''')

    conn.commit()
    conn.close()
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_db()