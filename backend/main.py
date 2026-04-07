from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/races")
def get_races(year: int = 2024):
    conn = get_connection()
    races = conn.execute(
        "SELECT * FROM races WHERE year = ? ORDER BY round", (year,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in races]

@app.get("/api/driver-standings")
def get_driver_standings(year: int = 2024):
    conn = get_connection()
    standings = conn.execute('''
        SELECT 
            driver_name,
            driver_code,
            team_name,
            SUM(points) as total_points,
            COUNT(CASE WHEN CAST(position AS INTEGER) = 1 THEN 1 END) as wins,
            COUNT(CASE WHEN CAST(position AS INTEGER) <= 3 THEN 1 END) as podiums,
            COUNT(*) as races,
            COUNT(CASE WHEN status NOT LIKE '%Lap%' 
                  AND status != 'Finished' 
                  AND status NOT LIKE '%+%' THEN 1 END) as dnfs
        FROM results
        JOIN races ON results.race_id = races.id
        WHERE races.year = ?
        GROUP BY driver_code
        ORDER BY total_points DESC
    ''', (year,)).fetchall()
    conn.close()
    return [dict(s) for s in standings]

@app.get("/api/team-standings")
def get_team_standings(year: int = 2024):
    conn = get_connection()
    standings = conn.execute('''
        SELECT
            team_name,
            SUM(points) as total_points,
            COUNT(CASE WHEN CAST(position AS INTEGER) = 1 THEN 1 END) as wins,
            COUNT(CASE WHEN CAST(position AS INTEGER) <= 3 THEN 1 END) as podiums,
            COUNT(CASE WHEN status NOT LIKE '%Lap%' 
                  AND status != 'Finished'
                  AND status NOT LIKE '%+%' THEN 1 END) as dnfs,
            COUNT(DISTINCT race_id) as races
        FROM results
        JOIN races ON results.race_id = races.id
        WHERE races.year = ?
        GROUP BY team_name
        ORDER BY total_points DESC
    ''', (year,)).fetchall()
    conn.close()
    return [dict(s) for s in standings]


@app.get("/api/team-standings-lineage")
def get_team_standings_lineage(lineage_id: int, include_lineage: bool = True):
    conn = get_connection()

    if include_lineage:
        # Group ALL historical names under the lineage
        standings = conn.execute('''
            SELECT
                tl.lineage_name as team_name,
                SUM(r.points) as total_points,
                COUNT(CASE WHEN CAST(r.position AS INTEGER) = 1 THEN 1 END) as wins,
                COUNT(CASE WHEN CAST(r.position AS INTEGER) <= 3 THEN 1 END) as podiums,
                COUNT(CASE WHEN r.status NOT LIKE '%Lap%'
                      AND r.status != 'Finished'
                      AND r.status NOT LIKE '%+%' THEN 1 END) as dnfs,
                COUNT(DISTINCT r.race_id) as races,
                MIN(rc.year) as first_year,
                MAX(rc.year) as last_year
            FROM results r
            JOIN races rc ON r.race_id = rc.id
            JOIN team_lineage tl ON r.team_name = tl.team_name
            WHERE tl.lineage_id = ?
            GROUP BY tl.lineage_name
        ''', (lineage_id,)).fetchall()
    else:
        standings = conn.execute('''
            SELECT
                r.team_name,
                SUM(r.points) as total_points,
                COUNT(CASE WHEN CAST(r.position AS INTEGER) = 1 THEN 1 END) as wins,
                COUNT(CASE WHEN CAST(r.position AS INTEGER) <= 3 THEN 1 END) as podiums,
                COUNT(CASE WHEN r.status NOT LIKE '%Lap%'
                      AND r.status != 'Finished'
                      AND r.status NOT LIKE '%+%' THEN 1 END) as dnfs,
                COUNT(DISTINCT r.race_id) as races
            FROM results r
            JOIN races rc ON r.race_id = rc.id
            JOIN team_lineage tl ON r.team_name = tl.team_name
            WHERE tl.lineage_id = ?
            GROUP BY r.team_name
        ''', (lineage_id,)).fetchall()

    conn.close()
    return [dict(s) for s in standings]

@app.get("/api/lineages")
def get_all_lineages():
    conn = get_connection()
    lineages = conn.execute('''
        SELECT DISTINCT lineage_id, lineage_name 
        FROM team_lineage 
        ORDER BY lineage_name
    ''').fetchall()
    conn.close()
    return [dict(l) for l in lineages]

@app.get("/api/next-race")
def get_next_race():
    conn = get_connection()
    race = conn.execute('''
        SELECT race_name, date FROM races
        WHERE date >= date('now')
        ORDER BY date ASC LIMIT 1
    ''').fetchone()
    conn.close()
    if race:
        return {"race_name": race["race_name"], "date": race["date"]}
    return {"race_name": "Off Season", "date": "2025-03-01"}

    