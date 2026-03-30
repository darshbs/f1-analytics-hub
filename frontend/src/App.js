import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line
} from "recharts";

const API = "http://127.0.0.1:8000";

const TEAM_COLORS = {
  "Red Bull Racing": "#3671C6",
  "McLaren": "#FF8000",
  "Ferrari": "#E8002D",
  "Mercedes": "#27F4D2",
  "Aston Martin": "#229971",
  "Alpine": "#FF87BC",
  "Haas F1 Team": "#B6BABD",
  "RB": "#6692FF",
  "Williams": "#64C4FF",
  "Kick Sauber": "#52E252",
};

const getTeamColor = (team) => TEAM_COLORS[team] || "#e10600";

// ── Reusable styled components ──────────────────────────────────────────────

const styles = {
  app: {
    background: "#0a0a0a",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "'Arial', sans-serif",
  },
  header: {
    background: "linear-gradient(90deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
    borderBottom: "3px solid #e10600",
    padding: "1.2rem 2rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: { color: "#e10600", fontSize: "1.6rem", fontWeight: 900, letterSpacing: "4px" },
  subtitle: { color: "#888", fontSize: "0.85rem", letterSpacing: "2px" },
  tabBar: {
    display: "flex",
    gap: "0.5rem",
    padding: "1.2rem 2rem 0",
    borderBottom: "1px solid #222",
  },
  tab: (active) => ({
    padding: "0.6rem 1.4rem",
    background: active ? "#e10600" : "transparent",
    color: active ? "#fff" : "#888",
    border: active ? "none" : "1px solid #333",
    borderRadius: "4px 4px 0 0",
    cursor: "pointer",
    fontWeight: active ? 700 : 400,
    fontSize: "0.85rem",
    letterSpacing: "1px",
    transition: "all 0.2s",
  }),
  page: { padding: "2rem" },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    marginBottom: "1.5rem",
  },
  card: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: "8px",
    padding: "1.5rem",
  },
  cardTitle: {
    color: "#e10600",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "1.2rem",
    borderBottom: "1px solid #222",
    paddingBottom: "0.6rem",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "10px 12px",
    borderBottom: "2px solid #e10600",
    textAlign: "left",
    fontSize: "0.75rem",
    letterSpacing: "1px",
    color: "#aaa",
    fontWeight: 700,
  },
  td: (i) => ({
    padding: "10px 12px",
    borderBottom: "1px solid #1a1a1a",
    fontSize: "0.9rem",
    background: i % 2 === 0 ? "#111" : "#131313",
  }),
  pos: (i) => ({
    color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#e10600",
    fontWeight: 700,
  }),
  teamDot: (team) => ({
    display: "inline-block",
    width: 10, height: 10,
    borderRadius: "50%",
    background: getTeamColor(team),
    marginRight: 8,
  }),
  statBadge: (color) => ({
    display: "inline-block",
    background: color + "22",
    color: color,
    border: `1px solid ${color}44`,
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "0.85rem",
    fontWeight: 700,
  }),
};

// ── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #333", padding: "10px 14px", borderRadius: 6 }}>
        <p style={{ color: "#e10600", fontWeight: 700, margin: 0 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || "#fff", margin: "4px 0 0", fontSize: "0.9rem" }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function YearSelector({ year, setYear }) {
  return (
    <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <span style={{ color: "#555", fontSize: "0.75rem", letterSpacing: "2px" }}>SEASON</span>
      {[2020, 2021, 2022, 2023, 2024].map(y => (
        <button key={y} onClick={() => setYear(y)} style={{
          padding: "4px 14px",
          background: year === y ? "#e10600" : "transparent",
          color: year === y ? "#fff" : "#555",
          border: year === y ? "none" : "1px solid #2a2a2a",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: year === y ? 700 : 400,
          fontSize: "0.85rem",
          transition: "all 0.2s"
        }}>
          {y}
        </button>
      ))}
    </div>
  );
}

// ── DRIVERS PAGE ─────────────────────────────────────────────────────────────
function DriversPage() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(2024);

  useEffect(() => {
    axios.get(`${API}/api/driver-standings?year=${year}`).then(r => setData(r.data));
  }, [year]);

  const chartData = data.slice(0, 10).map(d => ({
    name: d.driver_code,
    Points: d.total_points,
    fill: getTeamColor(d.team_name),
  }));

  return (
    <div style={styles.page}>
      <YearSelector year={year} setYear={setYear} />
      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Points — Top 10 Drivers</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 11 }} />
              <YAxis tick={{ fill: "#888", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Points" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Race Wins — Top 10 Drivers</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data.filter(d => d.wins > 0).map(d => ({
                name: d.driver_code, Wins: d.wins, fill: getTeamColor(d.team_name)
              }))}
              margin={{ top: 0, right: 10, left: -10, bottom: 0 }}
            >
              <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 11 }} />
              <YAxis tick={{ fill: "#888", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Wins" radius={[4, 4, 0, 0]}>
                {data.filter(d => d.wins > 0).map((entry, i) => (
                  <Cell key={i} fill={getTeamColor(entry.team_name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>{year} Driver Championship</div>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Pos", "Driver", "Team", "Points", "Wins", "Podiums", "DNFs", "Races"].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.driver_code}>
                <td style={styles.td(i)}><span style={styles.pos(i)}>{i + 1}</span></td>
                <td style={styles.td(i)}><strong>{d.driver_name}</strong></td>
                <td style={styles.td(i)}><span style={styles.teamDot(d.team_name)} />{d.team_name}</td>
                <td style={styles.td(i)}><span style={styles.statBadge("#e10600")}>{d.total_points}</span></td>
                <td style={styles.td(i)}>{d.wins}</td>
                <td style={styles.td(i)}>{d.podiums}</td>
                <td style={styles.td(i)}><span style={{ color: d.dnfs > 3 ? "#ff4444" : "#aaa" }}>{d.dnfs}</span></td>
                <td style={styles.td(i)}>{d.races}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── TEAMS PAGE ────────────────────────────────────────────────────────────────
function TeamsPage() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(2024);

  useEffect(() => {
    axios.get(`${API}/api/team-standings?year=${year}`).then(r => setData(r.data));
  }, [year]);

  const pieData = data.map(t => ({ name: t.team_name, value: t.total_points }));

  return (
    <div style={styles.page}>
      <YearSelector year={year} setYear={setYear} />
      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Points Distribution by Constructor</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={getTeamColor(entry.name)} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(val) => <span style={{ color: "#aaa", fontSize: 11 }}>{val}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>DNFs by Constructor</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data.map(t => ({ name: t.team_name.replace(" F1 Team", ""), DNFs: t.dnfs }))}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 40, bottom: 0 }}
            >
              <XAxis type="number" tick={{ fill: "#888", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#aaa", fontSize: 10 }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="DNFs" radius={[0, 4, 4, 0]}>
                {data.map((entry, i) => <Cell key={i} fill={getTeamColor(entry.team_name)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>{year} Constructor Championship</div>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Pos", "Team", "Points", "Wins", "Podiums", "DNFs", "Races"].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((t, i) => (
              <tr key={t.team_name}>
                <td style={styles.td(i)}><span style={styles.pos(i)}>{i + 1}</span></td>
                <td style={styles.td(i)}><span style={styles.teamDot(t.team_name)} /><strong>{t.team_name}</strong></td>
                <td style={styles.td(i)}><span style={styles.statBadge("#e10600")}>{t.total_points}</span></td>
                <td style={styles.td(i)}>{t.wins}</td>
                <td style={styles.td(i)}>{t.podiums}</td>
                <td style={styles.td(i)}><span style={{ color: t.dnfs > 5 ? "#ff4444" : "#aaa" }}>{t.dnfs}</span></td>
                <td style={styles.td(i)}>{t.races}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── RACES PAGE ────────────────────────────────────────────────────────────────
function RacesPage() {
  const [races, setRaces] = useState([]);
  const [year, setYear] = useState(2024);

  useEffect(() => {
    axios.get(`${API}/api/races?year=${year}`).then(r => setRaces(r.data));
  }, [year]);

  return (
    <div style={styles.page}>
      <YearSelector year={year} setYear={setYear} />
      <div style={styles.card}>
        <div style={styles.cardTitle}>{year} Race Calendar</div>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Round", "Race", "Circuit", "Country", "Date"].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {races.map((r, i) => (
              <tr key={r.id}>
                <td style={styles.td(i)}><span style={{ color: "#e10600", fontWeight: 700 }}>R{r.round}</span></td>
                <td style={styles.td(i)}><strong>{r.race_name}</strong></td>
                <td style={styles.td(i)}>{r.circuit}</td>
                <td style={styles.td(i)}>{r.country}</td>
                <td style={styles.td(i)}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage() {
  const [drivers, setDrivers] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/driver-standings?year=2024`).then(r => setDrivers(r.data));
    axios.get(`${API}/api/team-standings?year=2024`).then(r => setTeams(r.data));
  }, []);

  const champion = drivers[0];
  const topTeam = teams[0];

  return (
    <div style={styles.page}>
      {/* Hero Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "2024 Champion", value: champion?.driver_name || "—", sub: champion?.team_name },
          { label: "Champion Points", value: champion?.total_points || "—", sub: "Season total" },
          { label: "Constructor Champion", value: topTeam?.team_name || "—", sub: `${topTeam?.total_points} pts` },
          { label: "Total Races", value: "24", sub: "2024 Season" },
        ].map((stat, i) => (
          <div key={i} style={{ ...styles.card, textAlign: "center" }}>
            <div style={{ color: "#666", fontSize: "0.7rem", letterSpacing: "2px", marginBottom: 8 }}>{stat.label.toUpperCase()}</div>
            <div style={{ color: "#e10600", fontSize: "1.5rem", fontWeight: 900 }}>{stat.value}</div>
            <div style={{ color: "#555", fontSize: "0.75rem", marginTop: 4 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Top 5 Drivers + Teams side by side */}
      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Top 5 Drivers</div>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Pos", "Driver", "Points"].map(h => <th key={h} style={styles.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {drivers.slice(0, 5).map((d, i) => (
                <tr key={d.driver_code}>
                  <td style={styles.td(i)}><span style={styles.pos(i)}>{i + 1}</span></td>
                  <td style={styles.td(i)}>
                    <span style={styles.teamDot(d.team_name)} />
                    {d.driver_name}
                  </td>
                  <td style={styles.td(i)}>{d.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Constructor Standings</div>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Pos", "Team", "Points"].map(h => <th key={h} style={styles.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {teams.slice(0, 5).map((t, i) => (
                <tr key={t.team_name}>
                  <td style={styles.td(i)}><span style={styles.pos(i)}>{i + 1}</span></td>
                  <td style={styles.td(i)}>
                    <span style={styles.teamDot(t.team_name)} />
                    {t.team_name}
                  </td>
                  <td style={styles.td(i)}>{t.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LineagePage() {
  const [lineages, setLineages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [includeLineage, setIncludeLineage] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/lineages`).then(r => {
      setLineages(r.data);
      setSelected(r.data[0]?.lineage_id);
    });
  }, []);

  useEffect(() => {
    if (selected) {
      axios.get(`${API}/api/team-standings-lineage?lineage_id=${selected}&include_lineage=${includeLineage}`)
        .then(r => setData(r.data));
    }
  }, [selected, includeLineage]);

  return (
    <div style={styles.page}>
      {/* Lineage Selector */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>Team Lineage Explorer</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {lineages.map(l => (
            <button key={l.lineage_id} onClick={() => setSelected(l.lineage_id)} style={{
              padding: "6px 16px",
              background: selected === l.lineage_id ? "#e10600" : "transparent",
              color: selected === l.lineage_id ? "#fff" : "#666",
              border: selected === l.lineage_id ? "none" : "1px solid #2a2a2a",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: selected === l.lineage_id ? 700 : 400
            }}>
              {l.lineage_name.replace(" Lineage", "")}
            </button>
          ))}
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <span style={{ color: "#555", fontSize: "0.75rem", letterSpacing: "2px" }}>MODE</span>
          <button onClick={() => setIncludeLineage(true)} style={{
            padding: "4px 14px",
            background: includeLineage ? "#e10600" : "transparent",
            color: includeLineage ? "#fff" : "#666",
            border: includeLineage ? "none" : "1px solid #2a2a2a",
            borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem"
          }}>
            Full Lineage
          </button>
          <button onClick={() => setIncludeLineage(false)} style={{
            padding: "4px 14px",
            background: !includeLineage ? "#e10600" : "transparent",
            color: !includeLineage ? "#fff" : "#666",
            border: !includeLineage ? "none" : "1px solid #2a2a2a",
            borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem"
          }}>
            Name Only
          </button>
          <span style={{ color: "#444", fontSize: "0.8rem" }}>
            {includeLineage
              ? "Showing combined stats across all historical team names"
              : "Showing stats per individual team name"}
          </span>
        </div>

        {/* Results Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              {["Team / Era", "Points", "Wins", "Podiums", "DNFs", "Races"].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((t, i) => (
              <tr key={i}>
                <td style={styles.td(i)}>
                  <span style={styles.teamDot(t.team_name)} />
                  <strong>{t.team_name}</strong>
                  {t.first_year && (
                    <span style={{ color: "#444", fontSize: "0.75rem", marginLeft: 8 }}>
                      {t.first_year}–{t.last_year}
                    </span>
                  )}
                </td>
                <td style={styles.td(i)}><span style={styles.statBadge("#e10600")}>{t.total_points}</span></td>
                <td style={styles.td(i)}>{t.wins}</td>
                <td style={styles.td(i)}>{t.podiums}</td>
                <td style={styles.td(i)}><span style={{ color: t.dnfs > 5 ? "#ff4444" : "#aaa" }}>{t.dnfs}</span></td>
                <td style={styles.td(i)}>{t.races}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");

  const tabs = [
    { id: "home", label: "🏠 HOME" },
    { id: "drivers", label: "🧑‍✈️ DRIVERS" },
    { id: "teams", label: "🏎 CONSTRUCTORS" },
    { id: "races", label: "📅 CALENDAR" },
    { id: "lineage", label: "🔀 LINEAGE" },
  ];

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.logo}>⬡ F1 ANALYTICS HUB</div>
          <div style={styles.subtitle}>FORMULA ONE DATA PLATFORM</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabBar}>
        {tabs.map(t => (
          <button key={t.id} style={styles.tab(tab === t.id)} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Pages */}
      {tab === "home" && <HomePage />}
      {tab === "drivers" && <DriversPage />}
      {tab === "teams" && <TeamsPage />}
      {tab === "races" && <RacesPage />}
      {tab === "lineage" && <LineagePage />}
    </div>
  );
  
}