// src/pages/gamepage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import CustomAudioPlayer from "../components/customaudioplayer";
import "../css/game.css";

const BACKEND_URL = "http://127.0.0.1:8888";

export default function GamePage({ onStart }) {
  const [score, setScore] = useState(0);
  const [text, setText] = useState("");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const navigate = useNavigate();

  // ✅ use the playlist that worked in DevTools
  const playlistId = "5Fyh5hwRzSQpefBEQkKS2D"; //https://open.spotify.com/playlist/3MSX420oh4ioV9oKp1JPT8?si=dbd1d5a73d0e481e
                                              //remove from https to playlist/ & ?si to the end

  const guess = (event) => {
    setText(event.target.value);
  };

  // modified to test submission logic
  const submit = async (event) => {
    event.preventDefault();

    //handle the guess
    const res = await fetch(`${BACKEND_URL}/guess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        guess: text,
        correct_answer: currentTrack?.name || ""
      }),
    });

    const result = await res.json();

    // result returns {correct, attempts, game_over}
    if (result.correct) {
      setScore(prev => prev + 300);
    }

    setAttempts(result.attempts || 0);
    if (result.game_over) {
      console.log("Game ended");
      navigate("/game-results");
      return;
    }
    setScore(prev => prev + 1); // temporary score increment to test
    setText("");
  };

  // ---- Helper: check token validity on mount ----
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
      setAttempts(0);
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
      <Sidebar onStart={onStart} />

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
                  <input className='guessinput' type="text" value={text} onChange={guess} placeholder="Type the song name..." />
                  <button className="btn btn-primary guessbtn" type="submit"> Guess </button>
                  <button className="btn btn-ghost skipbtn" onClick={fetchRandomTrack}> Skip </button>
                </form>
            </div>
            <div className="game-score">
              <h1 className="game-headline">
                <span>Score: {score}</span>
              </h1>
            </div>
          </div>

          <section className="now-playing-section">
            <div className="now-playing-img">
              <img src="../../public/song_cover.png" alt="Song" width={300}/>
            </div>

            {/* {error && <div className="error">{error}</div>} */}

            {/* Debug: show which track + URL we currently have
            <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
              <strong>Debug current track:</strong>{" "}
              {currentTrack ? currentTrack.name : "(none)"}
              <br />
              <strong>Preview URL:</strong>{" "}
              {previewUrl ? previewUrl : "(none)"}
            </div> */}
            {/* <div className="now-playing-audio">
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
            </div> */}
            <div className="now-playing-audio">
              <CustomAudioPlayer src={previewUrl || undefined} />
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
