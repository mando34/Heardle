// src/pages/gameResultsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import "../css/game-results.css";
import "../css/home.css";

const API_BASE = "http://127.0.0.1:8888";

export default function GameResults() {
  const location = useLocation();
  const navigate = useNavigate();

  // State passed from GamePage (we provide fallbacks)
  const {
    outcome = "Lose",                // "Win" or "Lose"
    points = 0,
    finalScore = 0,
    songTitle = "Unknown title",
    songArtist = "Unknown artist",
    attemptsUsed = 0,
  } = location.state || {};

  const [leaderboard, setLeaderboard] = useState([]);
  const [history, setHistory] = useState([]);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/leaderboard`);
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, []);

  // Fetch history for current user if we know their uid
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/history?uid=${Number(userId)}`);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, []);

  const handlePlayAgain = () => {
    navigate("/gamepage");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="app-root">
      <Sidebar active="play" />
      <main className="main">
        <Topbar />

        <section className="results-wrap">
          <div className="results-container">
            <h1 className="headline">
              <span>{outcome === "Win" ? "Nice job!" : "Game Over"}</span>
            </h1>

            <p className="tagline">
              {outcome === "Win"
                ? `You guessed it! +${points} points`
                : "You ran out of attempts this round."}
            </p>

            <div className="results-grid">
              {/* Last track info */}
              <div className="results-card">
                <h3>The track you just listened to</h3>
                {/* If you have a cover URL, you can pass it via state and show it here */}
                <p className="song-title">{songTitle}</p>
                <p className="artist">{songArtist}</p>
                <p className="small">
                  Attempts used: <strong>{attemptsUsed}</strong>
                </p>
                <p className="small">
                  Points this round: <strong>{points}</strong>
                </p>
                <p className="small">
                  Your total score: <strong>{finalScore}</strong>
                </p>
              </div>

              {/* History (recent games) */}
              <div className="results-card">
                <h3>Your recent games</h3>
                {history.length === 0 ? (
                  <p className="small">
                    No history yet, or you’re not logged in.
                  </p>
                ) : (
                  <ul>
                    {history.slice(0, 5).map((h, idx) => (
                      <li key={idx}>
                        <strong>{h.mode || "Mode"}</strong> — {h.title || "Genre"} —{" "}
                        <span className="score">{h.score}</span> ({h.result})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Leaderboard */}
              <div className="results-card">
                <h3>Leaderboard</h3>
                {leaderboard.length === 0 ? (
                  <p className="small">No leaderboard data yet.</p>
                ) : (
                  <ul className="leaderboard-list">
                    {leaderboard.slice(0, 5).map((p) => (
                      <p key={p.rank}>
                        #{p.rank} {p.name} —{" "}
                        <span className="score">{p.score}</span>{" "}
                        <span className="small">
                          ({Math.round(p.win_rate * 100)}% win rate)
                        </span>
                      </p>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="results-btns cta-row">
              <button className="btn btn-primary" onClick={handlePlayAgain}>
                Play Again!
              </button>
              <button className="btn btn-ghost" onClick={handleGoHome}>
                Home
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
