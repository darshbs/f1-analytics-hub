# <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" height="30"/> F1 ANALYTICS HUB - FAH

<div align="center">

![Status](https://img.shields.io/badge/Status-In%20Development-e10600?style=for-the-badge)
![Phase](https://img.shields.io/badge/Phase-2B%20Complete-229971?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11-3671C6?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

```
LIGHTS OUT AND AWAY WE GO — INTO THE DATA.
```

**A full-stack Formula 1 data analytics and visualization platform.**
Historical stats, live race data, driver & constructor breakdowns — all in one pit wall.

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 🏁 What Is This?

**F1 Analytics Hub** is a portfolio-grade data science project that pulls official Formula 1 data using the **FastF1** library, stores it in a structured **SQLite** database, serves it through a **FastAPI** REST backend, and visualizes everything in a dark-themed **React** frontend built to feel like an actual F1 broadcast dashboard.

This isn't just a stats table. It's a full data engineering pipeline — from raw telemetry to interactive charts — covering 5 seasons of F1 data (2020–2024), with team lineage support, multi-season filtering, and official team color mapping throughout.

---

## 🛠 Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **Data Source** | FastF1 + Jolpica-F1 API | Official F1 timing & historical data |
| **Data Processing** | Python + Pandas | Clean, transform, and aggregate race data |
| **Backend** | FastAPI + Uvicorn | REST API serving all analytics endpoints |
| **Database** | SQLite | Persistent local store for all race & result data |
| **Frontend** | React 18 | Component-based UI with tab navigation |
| **Charts** | Recharts | Interactive bar, pie, and line charts |
| **HTTP Client** | Axios | React ↔ FastAPI communication |

---

## 📊 Features

### ✅ Phase 1 — Proof of Concept
- End-to-end pipeline: FastF1 → FastAPI → Browser confirmed working
- Single race podium data fetched and displayed live

### ✅ Phase 2A — Database & React Foundation
- SQLite database with `races` and `results` tables
- Full 2024 season seeded via FastF1
- FastAPI endpoints for races, driver standings, and team standings
- React app with dark F1-themed UI

### ✅ Phase 2B — Charts, Multi-Season & Lineage
- **5 seasons of data** (2020–2024) — 107 races, 2,000+ results
- **Year selector** — switch between seasons on all pages instantly
- **Points bar chart** — top 10 drivers by season points with team colors
- **Wins bar chart** — race winners breakdown per season
- **Constructor points pie chart** — points distribution across all teams
- **DNF horizontal bar chart** — reliability comparison across constructors
- **Home dashboard** — champion stats, top 5 drivers & constructors at a glance
- **Official team colors** — every chart and table uses real F1 team hex codes
- **Team Lineage Explorer** — toggle between "Full Lineage" (combined historical stats) and "Name Only" (per team name) to track teams across name changes (e.g. Racing Point → Aston Martin)
- **Full standings tables** — points, wins, podiums, DNFs, and race count per driver and constructor

### 🔄 Phase 3 — Coming Soon
- [ ] Extended historical data (pre-2020 seasons)
- [ ] Driver career profile pages
- [ ] Interactive country/circuit win map
- [ ] Head-to-head teammate comparison tool
- [ ] Tire strategy heatmaps (FastF1 telemetry)
- [ ] The What-If Machine (apply different points systems to historic seasons)
- [ ] ML race predictor (Gradient Boosting on qualifying data)
- [ ] UI polish — fonts, animations, live race countdown
- [ ] Auto-updating pipeline after every race weekend
- [ ] Deployment (Vercel + Railway)

---

## 🗂 Project Structure

```
f1-analytics-hub/
├── backend/
│   ├── main.py              # FastAPI app — all REST endpoints
│   ├── database.py          # SQLite schema & connection helper
│   ├── seed.py              # Data pipeline: FastF1 → SQLite (race results)
│   ├── seed_lineage.py      # Lineage mapping seeder
│   ├── requirements.txt     # Python dependencies
│   ├── cache/               # FastF1 local cache (gitignored)
│   └── f1.db                # SQLite database (gitignored)
└── frontend/
    ├── src/
    │   └── App.js           # Main React app — all pages, charts & components
    └── package.json
```

---

## ⚡ Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the repo
```bash
git clone https://github.com/darshbs/f1-analytics-hub.git
cd f1-analytics-hub
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

mkdir cache
python database.py           # Creates f1.db with schema
python seed_lineage.py       # Seeds team lineage mapping
python seed.py               # Seeds race data (~15-20 mins for all seasons)
uvicorn main:app --reload    # Starts API at http://127.0.0.1:8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start                    # Opens http://localhost:3000
```

> **Note:** You need **both terminals running** at the same time — one for the backend, one for the frontend.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/races?year=2024` | All races for a given season |
| `GET` | `/api/driver-standings?year=2024` | Driver championship standings with wins, podiums, DNFs |
| `GET` | `/api/team-standings?year=2024` | Constructor standings with wins, podiums, DNFs |
| `GET` | `/api/lineages` | All team lineage groups |
| `GET` | `/api/team-standings-lineage?lineage_id=1&include_lineage=true` | Team stats grouped by lineage or individual name |

Explore all endpoints interactively at: `http://127.0.0.1:8000/docs`

---

## 🔀 Team Lineage System

One of the most unique features of F1 Analytics Hub is the **lineage toggle** — because F1 team history is messy. The same physical team entry can race under completely different names across seasons.

| Lineage | Historical Names (in our dataset) |
|---|---|
| Red Bull | Red Bull Racing |
| Aston Martin | Racing Point → Aston Martin |
| Alpine | Renault → Alpine |
| Mercedes | Mercedes |
| RB | AlphaTauri → RB |
| Kick Sauber | Alfa Romeo → Kick Sauber |

Toggle **Full Lineage** to see combined career stats across all names. Toggle **Name Only** to see each name as a separate team entry.

---

## 🎨 Official Team Color Palette

| Team | Hex | Team | Hex |
|---|---|---|---|
| 🔵 Red Bull Racing | `#3671C6` | 🩵 Mercedes | `#27F4D2` |
| 🟠 McLaren | `#FF8000` | 🟢 Aston Martin | `#229971` |
| 🔴 Ferrari | `#E8002D` | 🩷 Alpine | `#FF87BC` |
| ⚪ Haas | `#B6BABD` | 💙 RB | `#6692FF` |
| 🔷 Williams | `#64C4FF` | 💚 Kick Sauber | `#52E252` |

---

## 🗺 Roadmap

```
Phase 1  ██████████  ✅  Proof of Concept — FastF1 → FastAPI → HTML
Phase 2A ██████████  ✅  SQLite DB + React Frontend
Phase 2B ██████████  ✅  Charts + Multi-Season + Team Colors + Lineage Toggle
Phase 3  ██░░░░░░░░  🔄  UI Polish + Extended History + Driver Profiles
Phase 4  ░░░░░░░░░░  🔜  Advanced Analytics + Telemetry + ML Predictor
Phase 5  ░░░░░░░░░░  🔜  Deployment + Auto-update Pipeline
```

---

## 📈 Data Coverage

| Season | Races | Status |
|---|---|---|
| 2020 | 17 | ✅ Seeded |
| 2021 | 22 | ✅ Seeded |
| 2022 | 22 | ✅ Seeded |
| 2023 | 22 | ✅ Seeded |
| 2024 | 24 | ✅ Seeded |
| **Total** | **107 races** | **2,000+ results** |

---

## 🙋 About

Built by **Darshan** as an M.Sc. Data Science portfolio project.

Combining a passion for Formula 1 with real-world data engineering — FastF1 telemetry, REST APIs, relational databases, and interactive React dashboards — to demonstrate end-to-end data science skills across the full stack.

---

<div align="center">

*This project is not affiliated with Formula 1, the FIA, or any F1 team.*

*All data is sourced from the publicly available FastF1 library and Jolpica-F1 API.*

**🏎️ Made by an F1 fan with love for the sport and data - for F1 fans ❤️**

</div>