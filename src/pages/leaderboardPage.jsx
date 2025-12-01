// src/pages/leaderboardPage.jsx
import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import "../css/leaderboard.css";
import { AuthContext } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8888";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  const auth = useContext(AuthContext) || {};
  const { user, userId, user_id } = auth;

  const effectiveUid =
    user?.user_id ??
    user?.id ??
    userId ??
    user_id ??
    null;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const historyUrl = effectiveUid
          ? `${API_BASE}/history?uid=${effectiveUid}`
          : `${API_BASE}/history`;

        const [lbRes, histRes] = await Promise.all([
          fetch(`${API_BASE}/leaderboard`),
          fetch(historyUrl),
        ]);

        if (!lbRes.ok) {
          const txt = await lbRes.text();
          throw new Error(`Leaderboard error ${lbRes.status}: ${txt}`);
        }
        if (!histRes.ok) {
          const txt = await histRes.text();
          throw new Error(`History error ${histRes.status}: ${txt}`);
        }

        const lbJson = await lbRes.json();
        const histJson = await histRes.json();

        setPlayers(
          lbJson.map((p) => ({
            rank: p.rank,
            name: p.name,
            score: p.score,
            winRate: p.win_rate ?? p.winRate ?? 0,
            avatarClass: "avatar-1",
          }))
        );

        setHistory(
          histJson.map((h) => ({
            mode: h.mode,
            title: h.title,
            score: h.score,
            result: h.result,
          }))
        );
      } catch (err) {
        console.error("Failed to load leaderboard/history:", err);
        setError(err.message || "Failed to load leaderboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [effectiveUid]);

  const getPillClass = (result) =>
    result === "Win"
      ? "historyPill historyPillWin"
      : "historyPill historyPillLoss";

  const PlayerRow = ({ p }) => (
    <tr>
      <td>{p.rank}</td>
      <td>
        <div className="playerCell">
          <div className={`avatar ${p.avatarClass}`} aria-hidden />
          <span>{p.name}</span>
        </div>
      </td>
      <td>{p.score.toLocaleString()}</td>
      <td>
        <div className="winrateCell">
          <div className="progress">
            <div
              className="progressFill"
              style={{ width: `${p.winRate * 100}%` }}
            />
          </div>
          <span>{Math.round(p.winRate * 100)}%</span>
        </div>
      </td>
    </tr>
  );

  const HistoryRow = ({ h }) => (
    <li className="historyRow">
      <div className="historyMain">
        <p className="historyTitle">
          {h.mode}: {h.title}
        </p>
      </div>
      <div className="historyMeta">
        <span className="historyScore">{h.score.toLocaleString()} Pts</span>
        <span className={getPillClass(h.result)}>{h.result}</span>
      </div>
    </li>
  );

  return (
    <div className="app-root">
      <Sidebar />
      <main className="main">
        <Topbar />
        <section className="leaderboardWrap">
          <div className="leaderboard">
            <h1 className="pageTitle">Leaderboard</h1>

            {loading && <p className="statusText">Loading...</p>}
            {error && <p className="statusText statusError">{error}</p>}

            <section className="card">
              <header className="leaderboardHeader">
                <div>
                  <h2 className="cardTitle">Global Leaderboard</h2>
                  <p className="cardSubtitle">
                    Top players from around the world.
                  </p>
                </div>
              </header>

              <div className="leaderboardTableWrap">
                <table className="leaderboardTable">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Score</th>
                      <th>Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((p) => (
                      <PlayerRow key={p.rank} p={p} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <h1 className="pageTitle">History</h1>

            <section className="card">
              <header className="cardHeader">
                <h3 className="cardTitle">Recent Game History</h3>
              </header>

              <ul className="historyList">
                {history.map((h, i) => (
                  <HistoryRow key={i} h={h} />
                ))}
              </ul>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
