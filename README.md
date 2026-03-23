# <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" height="30"/> F1 ANALYTICS HUB - FAH

<div align="center">

![Status](https://img.shields.io/badge/Status-In%20Development-e10600?style=for-the-badge)
![Phase](https://img.shields.io/badge/Phase-2B%20In%20Progress-FF8000?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11-3671C6?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

```
LIGHTS OUT AND AWAY WE GO — INTO THE DATA.
```

**A full-stack Formula 1 data analytics and visualization platform.**
Historical stats, live race data, driver & constructor breakdowns — all in one pit wall.

[Live Demo](Soon) · [Report Bug](Soon) · [Request Feature](Soon)

</div>

---

## 🏁 What Is This?

**F1 Analytics Hub** is a portfolio-grade data science project that pulls official Formula 1 data using the **FastF1** library, stores it in a structured **SQLite** database, serves it through a **FastAPI** REST backend, and visualizes everything in a dark-themed **React** frontend built to feel like an actual F1 broadcast dashboard.

This isn't just a stats table. It's a full data engineering pipeline — from raw telemetry to interactive charts — covering every team and driver from the modern era, with historical lineage support planned.

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

### ✅ Live Now
- **Driver Championship Standings** — Points, wins, podiums, DNFs, and race count per driver
- **Constructor Championship Standings** — Full team breakdown with color-coded team identities
- **Race Calendar** — Full season schedule with circuit and country data
- **Points Bar Chart** — Top 10 drivers by season points with official team colors
- **Wins Bar Chart** — Race winners breakdown
- **Constructor Points Pie Chart** — Points distribution across all teams
- **DNF Horizontal Bar Chart** — Reliability comparison across constructors
- **Home Dashboard** — Champion stats, top 5 drivers & constructors at a glance
- **Official Team Colors** — Every chart and table uses real F1 team hex codes

### 🔄 Coming Soon (Phase 2B+)
- [ ] Multi-season data (2020–2024) with year selector
- [ ] Team lineage toggle (e.g. Jaguar → Red Bull as one continuous story)
- [ ] Driver career profile pages
- [ ] Interactive country win map (wins by circuit/country)
- [ ] DNF trend line over a season
- [ ] Head-to-head teammate comparison tool
- [ ] Tire strategy heatmaps
- [ ] FastF1 telemetry traces (speed, throttle, braking overlays)
- [ ] The What-If Machine (apply modern points to classic seasons)
- [ ] ML race predictor (Gradient Boosting on qualifying data)
- [ ] Live race countdown timer
- [ ] Auto-updating pipeline after every race weekend
- [ ] Deployment (Vercel + Railway)

---

## 🗂 Project Structure

```
f1-analytics-hub/
├── backend/
│   ├── main.py          # FastAPI app — all REST endpoints
│   ├── database.py      # SQLite schema & connection helper
│   ├── seed.py          # Data pipeline: FastF1 → SQLite
│   ├── cache/           # FastF1 local cache (gitignored)
│   └── f1.db            # SQLite database (gitignored)
└── frontend/
    ├── src/
    │   └── App.js       # Main React app — all pages & charts
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

pip install fastf1 fastapi uvicorn pandas

mkdir cache
python database.py           # Creates f1.db
python seed.py               # Seeds 2024 season (~5 mins)
uvicorn main:app --reload    # Starts API at http://127.0.0.1:8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start                    # Opens http://localhost:3000
```

> You need **both terminals running** at the same time — one for the backend, one for the frontend.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/races?year=2024` | All races for a season |
| `GET` | `/api/driver-standings?year=2024` | Driver championship standings |
| `GET` | `/api/team-standings?year=2024` | Constructor championship standings |

Explore all endpoints interactively at: `http://127.0.0.1:8000/docs`

---

## 🎨 Team Color Palette

| Team | Color | Hex |
|---|---|---|
| Red Bull Racing | 🔵 | `#3671C6` |
| McLaren | 🟠 | `#FF8000` |
| Ferrari | 🔴 | `#E8002D` |
| Mercedes | 🩵 | `#27F4D2` |
| Aston Martin | 🟢 | `#229971` |
| Alpine | 🩷 | `#FF87BC` |
| Haas | ⚪ | `#B6BABD` |
| RB | 💙 | `#6692FF` |
| Williams | 🔷 | `#64C4FF` |
| Kick Sauber | 💚 | `#52E252` |

---

## 🗺 Roadmap

```
Phase 1  ██████████  ✅  Proof of Concept — FastF1 → FastAPI → HTML
Phase 2A ██████████  ✅  SQLite DB + React Frontend
Phase 2B ████░░░░░░  🔄  Charts + Navigation + Team Colors
Phase 3  ░░░░░░░░░░  🔜  Multi-season + Lineage Toggle + Map
Phase 4  ░░░░░░░░░░  🔜  Advanced Analytics + ML Predictor
Phase 5  ░░░░░░░░░░  🔜  Deployment + Auto-update Pipeline
```

---

## 📸 Screenshots

> Coming soon — UI screenshots will be added after Phase 2B is complete.

---

## 🙋 About

Built by **Darshan** as an M.Sc. Data Science portfolio project.

Combining a passion for Formula 1 with real-world data engineering — FastF1 telemetry, REST APIs, relational databases, and interactive React dashboards — to demonstrate end-to-end data science skills.

---

<div align="center">


*This project is not affiliated with Formula 1, the FIA, or any F1 team.*
*All data is sourced from the publicly available FastF1 library and Jolpica-F1 API.*

**Made by an F1 fan with love for the sport and data - for F1 fans ❤️**

</div>