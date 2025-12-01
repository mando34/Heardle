// src/pages/gamepage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import "../css/game.css";

const API_BASE = "http://127.0.0.1:8888"; // backend base URL

export default function GamePage() {
  const [score, setScore] = useState(0);
  const [text, setText] = useState("");

  const [currentSong, setCurrentSong] = useState("");
  const [currentArtist, setCurrentArtist] = useState("");
  const [currentFile, setCurrentFile] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const [attempt, setAttempt] = useState(1);
  const [snippet, setSnippet] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // "correct" | "wrong" | "info"

  const [accessToken, setAccessToken] = useState(null);

  const navigate = useNavigate();

  // ---- helper: call backend to record result & then go to results page ----
  const finalizeGame = useCallback(
    async (outcome, pointsThisGame) => {
      // Optional: read difficulty/genre from state or UI; hard-code for now
      const difficulty = "Single Player";
      const genre = "Mixed";

      // If you have an auth token/user id from your login system:
      const authToken = localStorage.getItem("auth_token");
      const userId = localStorage.getItem("user_id"); // if you store it

      try {
        await fetch(`${API_BASE}/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({
            result: outcome,          // "Win" or "Lose"
            score_delta: pointsThisGame,
            difficulty,
            genre,
            // uid is optional; backend can derive from auth, or you can send it
            ...(userId ? { uid: Number(userId) } : {}),
          }),
        });
      } catch (err) {
        console.error("Failed to record game result:", err);
      }

      // Now navigate to results page with info about this game
      navigate("/gameresults", {
        replace: true,
        state: {
          outcome,               // "Win" or "Lose"
          points: pointsThisGame,
          finalScore: score + pointsThisGame,
          songTitle: currentSong,
          songArtist: currentArtist,
          attemptsUsed: attempt,
        },
      });
    },
    [attempt, currentArtist, currentSong, navigate, score]
  );

  // ---- Start / reset a round from your game backend ----
  const startGame = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setFeedback("");
      setFeedbackType("");
      setText("");
      setAttempt(1);

      const res = await fetch(`${API_BASE}/start`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to start game");
      }

      const data = await res.json();
      console.log("Started", data);

      setCurrentSong(data.name);
      setCurrentArtist(data.artist);
      setCurrentFile(data.filename);
      setPreviewUrl(`${API_BASE}/song/${data.filename}`);

      if (typeof data.snippet_seconds === "number") {
        setSnippet(data.snippet_seconds);
      } else {
        setSnippet(1);
      }
    } catch (err) {
      console.error("Cant start game:", err);
      setError("Could not start game. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGuessChange = (event) => {
    setText(event.target.value);
  };

  // ---- Submit guess: only adds score on win, uses backend snippet_seconds ----
  const submit = async (event) => {
    event.preventDefault();
    setFeedback("");
    setFeedbackType("");

    if (!currentFile || !previewUrl) {
      setFeedback("No song loaded yet.");
      setFeedbackType("info");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: currentFile,
          song_url: previewUrl,
          guess: text,
          attempt,
        }),
      });

      const result = await res.json();
      console.log("User guess:", text);
      console.log("Guess result", result);

      if (!res.ok) {
        throw new Error(result.error || "Guess failed");
      }

      if (result.win) {
        console.log("Correct guess");
        const pointsThisGame = 300; // or result.points from backend
        setScore((prev) => prev + pointsThisGame);
        setFeedback("Correct! +300 points 🎉");
        setFeedbackType("correct");

        // ✅ Finish game: record result + go to results page
        await finalizeGame("Win", pointsThisGame);
        return;
      }

      if (result.lose) {
        console.log("Out of attempts");
        const answer =
          result.answer ||
          (currentSong && currentArtist
            ? `"${currentSong}" by ${currentArtist}`
            : "this song");
        setFeedback(`Out of attempts! The song was ${answer}.`);
        setFeedbackType("info");

        // ✅ Finish game as a loss (no points)
        await finalizeGame("Lose", 0);
        return;
      }

      if (result.continue) {
        console.log("Incorrect guess, continue");
        setAttempt(result.next_attempt);
        if (typeof result.snippet_seconds === "number") {
          setSnippet(result.snippet_seconds);
        }
        setFeedback("Wrong, try again with a longer snippet.");
        setFeedbackType("wrong");
      }
    } catch (err) {
      console.error("Cant guess:", err);
      setFeedback("Error submitting guess. Please try again.");
      setFeedbackType("info");
    } finally {
      setLoading(false);
    }
  };

  // ---- Skip: does NOT submit form, does NOT change score,
  // ---- just consumes an attempt & extends snippet via backend ----
  const handleSkip = async (event) => {
    event.preventDefault();
    setFeedback("");
    setFeedbackType("");

    if (!currentFile || !previewUrl) {
      setFeedback("No song loaded to skip.");
      setFeedbackType("info");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: currentFile,
          song_url: previewUrl,
          guess: "", // treat as skip/blank guess
          attempt,
        }),
      });

      const result = await res.json();
      console.log("Skip result", result);

      if (!res.ok) {
        throw new Error(result.error || "Skip failed");
      }

      if (result.win) {
        // Very unlikely for empty guess, but handle just in case
        const pointsThisGame = 300;
        setScore((prev) => prev + pointsThisGame);
        setFeedback("Correct! +300 points 🎉");
        setFeedbackType("correct");
        await finalizeGame("Win", pointsThisGame);
        return;
      }

      if (result.lose) {
        const answer =
          result.answer ||
          (currentSong && currentArtist
            ? `"${currentSong}" by ${currentArtist}`
            : "this song");
        setFeedback(`Out of attempts! The song was ${answer}.`);
        setFeedbackType("info");
        await finalizeGame("Lose", 0);
        return;
      }

      if (result.continue) {
        setAttempt(result.next_attempt);
        if (typeof result.snippet_seconds === "number") {
          setSnippet(result.snippet_seconds);
        }
        setFeedback("Revealing more of the song...");
        setFeedbackType("info");
      }
    } catch (err) {
      console.error("Skip error:", err);
      setFeedback("Error skipping. Please try again.");
      setFeedbackType("info");
    } finally {
      setLoading(false);
    }
  };

  // ---- Spotify token gate ----
  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    const expiresAtStr = localStorage.getItem("spotify_token_expires_at");

    if (!token || !expiresAtStr) {
      navigate("/spotifylogin");
      return;
    }

    const expiresAt = Number(expiresAtStr);
    const now = Date.now();

    if (Number.isNaN(expiresAt) || now >= expiresAt) {
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_refresh_token");
      localStorage.removeItem("spotify_token_expires_at");
      navigate("/spotifylogin");
      return;
    }

    setAccessToken(token);
  }, [navigate]);

  // ---- Load first song once authenticated ----
  useEffect(() => {
    if (accessToken) {
      startGame();
    }
  }, [accessToken, startGame]);

  if (!accessToken) {
    return <p>Checking Spotify login...</p>;
  }

  return (
    <div className="app-root">
      <Sidebar active="play" />

      <main className="main">
        <Topbar />

        <section className="game-section">
          <div className="game-wrap">
            <div>
              <h1 className="game-headline">
                <span>Guess the Song</span>
              </h1>
            </div>

            <div className="input-wrap">
              <form onSubmit={submit}>
                <input
                  className="guessinput"
                  type="text"
                  value={text}
                  onChange={handleGuessChange}
                  placeholder="Type the song name..."
                />
                <button
                  className="btn btn-primary guessbtn"
                  type="submit"
                  disabled={loading}
                >
                  Guess
                </button>
                {/* IMPORTANT: type="button" so Skip does NOT submit the form */}
                <button
                  className="btn btn-ghost skipbtn"
                  type="button"
                  onClick={handleSkip}
                  disabled={loading}
                >
                  Skip
                </button>
              </form>

              {feedback && (
                <div className={`guess-feedback ${feedbackType}`}>
                  {feedback}
                </div>
              )}
            </div>

            <div className="game-score">
              <h1 className="game-headline">
                <span>Score: {score}</span>
              </h1>
            </div>
          </div>

          <section className="now-playing-section">
            <div className="now-playing-img">
              <img src="/song_cover.png" alt="Song" width={300} />
            </div>

            <div className="now-playing-audio">
              <CustomAudioPlayer
                src={previewUrl || undefined}
                snippet={snippet}
              />
            </div>

            {error && <div className="game-error">{error}</div>}
          </section>
        </section>
      </main>
    </div>
  );
}
