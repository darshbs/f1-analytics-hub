import fastf1
import sqlite3
from database import get_connection, init_db

fastf1.Cache.enable_cache('cache')

def seed_season(year: int):
    conn = get_connection()
    cursor = conn.cursor()

    print(f"Seeding {year} season...")

    schedule = fastf1.get_event_schedule(year, include_testing=False)

    for _, event in schedule.iterrows():
        round_num = event['RoundNumber']
        race_name = event['EventName']
        circuit = event['Location']
        country = event['Country']
        date = str(event['EventDate'].date())

        # Skip future races
        try:
            session = fastf1.get_session(year, round_num, 'R')
            session.load(telemetry=False, weather=False, messages=False)
        except Exception as e:
            print(f"  Skipping round {round_num} ({race_name}): {e}")
            continue

        # Insert race
        cursor.execute('''
            INSERT INTO races (year, round, race_name, circuit, country, date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (year, round_num, race_name, circuit, country, date))
        race_id = cursor.lastrowid

        # Insert results
        results = session.results
        for _, row in results.iterrows():
            try:
                # Position is stored as float (1.0, 2.0) in FastF1 — convert safely
                raw_pos = row['Position']
                try:
                    position = int(float(raw_pos))
                except (ValueError, TypeError):
                    position = None

                cursor.execute('''
                    INSERT INTO results 
                    (race_id, position, driver_name, driver_code, team_name, points, status, laps)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    race_id,
                    position,
                    str(row['BroadcastName']),
                    str(row['Abbreviation']),
                    str(row['TeamName']),
                    float(row['Points']),
                    str(row['Status']),
                    int(row['ClassifiedPosition']) if str(row['ClassifiedPosition']).isdigit() else 0
                ))
            except Exception as e:
                print(f"    Skipping driver row: {e}")
                continue

        conn.commit()
        print(f"  ✅ Round {round_num}: {race_name}")

    conn.close()
    print(f"\n✅ {year} season seeded successfully!")

if __name__ == "__main__":
    seed_season(2022)