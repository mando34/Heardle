// src/pages/gamepage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import "../css/game.css";

const BACKEND_URL = "http://127.0.0.1:8888";

export default function GamePage() {
  const [score, setScore] = useState(0);
  const [text, setText] = useState("");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState(null);

  const navigate = useNavigate();

  // ✅ use the playlist that worked in DevTools
  const playlistId = "5Fyh5hwRzSQpefBEQkKS2D";

  const guess = (event) => {
    setText(event.target.value);
  };

  const submit = (event) => {
    event.preventDefault();
    setScore((prev) => prev + 1);
  };

  // ---- Helper: check token validity on mount ----
  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    const expiresAtStr = localStorage.getItem("spotify_token_expires_at");

    if (!token || !expiresAtStr) {
      navigate("/login");
      return;
    }

    const expiresAt = Number(expiresAtStr);
    const now = Date.now();

    if (Number.isNaN(expiresAt) || now >= expiresAt) {
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_refresh_token");
      localStorage.removeItem("spotify_token_expires_at");
      navigate("/login");
      return;
    }

    setAccessToken(token);
  }, [navigate]);

  // ---- Fetch random track from playlist ----
  const fetchRandomTrack = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Spotify error body:", data);
        const msg =
          data?.error?.message || "Failed to fetch playlist tracks";
        throw new Error(msg);
      }

      // log all previews so we can see what's going on
      const mapped = data.items.map((i) => ({
        name: i.track?.name,
        preview: i.track?.preview_url,
      }));
      console.log("Tracks + previews:", mapped);

      const itemsWithPreview = data.items.filter(
        (item) => item.track && item.track.preview_url
      );
      console.log(
        "Number of tracks with preview_url:",
        itemsWithPreview.length
      );

      if (itemsWithPreview.length === 0) {
        setError(
          "This playlist has no previewable tracks. Try a different playlist ID."
        );
        setPreviewUrl("");
        setCurrentTrack(null);
        return;
      }

      const randomIndex = Math.floor(
        Math.random() * itemsWithPreview.length
      );
      const track = itemsWithPreview[randomIndex].track;

      console.log("Chosen track:", track.name, track.preview_url);

      setCurrentTrack(track);
      setPreviewUrl(track.preview_url);
      setText("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching song");
      setPreviewUrl("");
      setCurrentTrack(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, playlistId]);

  // Fetch a track when we finally have a valid token
  useEffect(() => {
    if (accessToken) {
      fetchRandomTrack();
    }
  }, [accessToken, fetchRandomTrack]);

  if (!accessToken) {
    return <p>Checking Spotify login...</p>;
  }

  return (
    <div className="app-root">
      <Sidebar />

      <main className="main">
        <Topbar />

        <section className="hero-wrap">
          <div className="game_type">
            <h1 className="headline">
              <span>Single Player Game</span>
            </h1>
          </div>

          <section className="hero-wrap">
            <div className="score">
              <h1 className="headline">
                <p>
                  <span>Score: {score}</span>
                </p>
              </h1>
            </div>
          </section>

          <section>
            <div className="now-playing">Now Playing</div>
            <div>Guess the song from the snippet!</div>

            {error && <div className="error">{error}</div>}

            {/* Debug: show which track + URL we currently have */}
            <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
              <strong>Debug current track:</strong>{" "}
              {currentTrack ? currentTrack.name : "(none)"}
              <br />
              <strong>Preview URL:</strong>{" "}
              {previewUrl ? previewUrl : "(none)"}
            </div>

            <div className="audio" style={{ marginTop: "1rem" }}>
              {loading ? (
                <p>Loading track...</p>
              ) : (
                <audio
                  controls
                  // undefined instead of "" avoids the React warning
                  src={previewUrl || undefined}
                  // autoplay might be blocked by browser; you may still need to click play
                  autoPlay
                />
              )}
            </div>
          </section>

          <section>
            <div className="now-playing"> Your Guess</div>
            <form onSubmit={submit}>
              <input
                type="text"
                value={text}
                onChange={guess}
                placeholder="Type song title or artist."
              />
              <button className="btn btn-primary" type="submit">
                Submit Guess
              </button>
            </form>
          </section>

          <button className="btn btn-ghost" onClick={fetchRandomTrack}>
            Skip
          </button>
        </section>
      </main>
    </div>
  );
}
