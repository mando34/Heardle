import React from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import "../css/game-results.css";
import "../css/home.css"; // 👈 include this for consistent layout

export default function GameResults({ onStart, onExit }) {
  const standings = [
    { name: "Alice", score: 1500, correct: 8 },
    { name: "Bob", score: 1200, correct: 6 },
    { name: "Charlie", score: 900, correct: 4 },
  ];

  const track = {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    cover: "https://upload.wikimedia.org/wikipedia/en/9/9f/Bohemian_Rhapsody.png",
  };

  const stats = {
    accuracy: 80,
    totalGuesses: 10,
    fastestGuess: 4.5,
  };

  return (
    <div className="app-root">
      <Sidebar onStart={onStart} />
      <main className="main">
        <Topbar />

        <section className="hero-wrap"> {/* same section wrapper as homepage */}
          <div className="hero"> {/* reuse .hero for consistent padding & centering */}
            <h1 className="headline">
              <span>Game Over!</span>
            </h1>

            <p className="tagline">Here’s how you stacked up.</p>

            <div className="results-grid">
              {/* Standings */}
              <div className="results-card">
                <h3>Final standings for all players</h3>
                <ul>
                  {standings.map((p, i) => (
                    <li key={i}>
                      {p.name}{" "}
                      <span className="score">{p.score}</span> ({p.correct} correct)
                    </li>
                  ))}
                </ul>
              </div>

              {/* Track */}
              <div className="results-card">
                <h3>The track you just listened to</h3>
                <img src={track.cover} alt={track.title} />
                <p className="song-title">{track.title}</p>
                <p className="artist">{track.artist}</p>
              </div>

              {/* Stats */}
              <div className="results-card">
                <h3>Detailed metrics</h3>
                <p>
                  Accuracy <span className="highlight">{stats.accuracy}%</span>
                </p>
                <p>Total Guesses {stats.totalGuesses}</p>
                <p>Fastest Guess {stats.fastestGuess} seconds</p>
              </div>
            </div>

            <div className="cta-row">
              <button className="btn btn-primary"onClick={onStart}>Play Again</button>
              <button className="btn btn-ghost" onClick={onExit}>Go to Home</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
