import sqlite3
from database import get_connection, init_db

LINEAGE_DATA = [
    # Red Bull lineage
    ("Stewart",          1, "Red Bull Lineage",    1997, 1999),
    ("Jaguar",           1, "Red Bull Lineage",    2000, 2004),
    ("Red Bull Racing",  1, "Red Bull Lineage",    2005, 2099),

    # Aston Martin lineage
    ("Jordan",           2, "Aston Martin Lineage", 1991, 2005),
    ("Midland",          2, "Aston Martin Lineage", 2006, 2006),
    ("Spyker",           2, "Aston Martin Lineage", 2007, 2007),
    ("Force India",      2, "Aston Martin Lineage", 2008, 2018),
    ("Racing Point",     2, "Aston Martin Lineage", 2019, 2020),
    ("Aston Martin",     2, "Aston Martin Lineage", 2021, 2099),

    # Alpine lineage
    ("Toleman",          3, "Alpine Lineage",       1981, 1985),
    ("Benetton",         3, "Alpine Lineage",       1986, 2001),
    ("Renault",          3, "Alpine Lineage",       2002, 2011),
    ("Lotus F1 Team",    3, "Alpine Lineage",       2012, 2015),
    ("Renault",          3, "Alpine Lineage",       2016, 2020),
    ("Alpine",           3, "Alpine Lineage",       2021, 2099),

    # Mercedes lineage
    ("BAR",              4, "Mercedes Lineage",     1999, 2005),
    ("Honda",            4, "Mercedes Lineage",     2006, 2008),
    ("Brawn",            4, "Mercedes Lineage",     2009, 2009),
    ("Mercedes",         4, "Mercedes Lineage",     2010, 2099),

    # Haas (no lineage - new team in 2016)
    ("Haas F1 Team",     5, "Haas",                 2016, 2099),

    # Williams
    ("Williams",         6, "Williams",             1977, 2099),

    # Ferrari
    ("Ferrari",          7, "Ferrari",              1950, 2099),

    # McLaren
    ("McLaren",          8, "McLaren",              1966, 2099),

    # RB / AlphaTauri / Toro Rosso
    ("Toro Rosso",       9, "RB Lineage",           2006, 2019),
    ("AlphaTauri",       9, "RB Lineage",           2020, 2023),
    ("RB",               9, "RB Lineage",           2024, 2099),

    # Kick Sauber lineage
    ("Sauber",          10, "Kick Sauber Lineage",  1993, 2018),
    ("Alfa Romeo",      10, "Kick Sauber Lineage",  2019, 2023),
    ("Kick Sauber",     10, "Kick Sauber Lineage",  2024, 2099),
]

def seed_lineage():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    # Clear existing lineage data
    cursor.execute("DELETE FROM team_lineage")

    for team_name, lineage_id, lineage_name, era_start, era_end in LINEAGE_DATA:
        cursor.execute('''
            INSERT OR REPLACE INTO team_lineage 
            (team_name, lineage_id, lineage_name, era_start, era_end)
            VALUES (?, ?, ?, ?, ?)
        ''', (team_name, lineage_id, lineage_name, era_start, era_end))

    conn.commit()
    conn.close()
    print(f"✅ Seeded {len(LINEAGE_DATA)} team lineage entries!")

if __name__ == "__main__":
    seed_lineage()