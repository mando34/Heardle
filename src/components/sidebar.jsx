// src/components/sidebar.jsx
import React, { useEffect, useState } from "react";
import "../css/sidebar.css";
import {
  MusicNoteIcon,
  HomeIcon,
  PlayIcon,
  LogoutIcon,
  TrophyIcon,
} from "./icons";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  // Check Spotify login status whenever the route changes
  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    const expiresAtStr = localStorage.getItem("spotify_token_expires_at");
    const expiresAt = expiresAtStr ? Number(expiresAtStr) : 0;

    if (token && expiresAt && Date.now() < expiresAt) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleHome = () => {
    navigate("/");
  };

  const handlePlay = () => {
    // your game route from App.jsx
    navigate("/gamepage");
  };

  const handleAuthClick = () => {
    if (loggedIn) {
      // 🔴 LOG OUT: clear tokens and go home
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_refresh_token");
      localStorage.removeItem("spotify_token_expires_at");
      setLoggedIn(false);
      navigate("/"); // back to homepage
    } else {
      // 🟢 LOG IN: go to the same login page users see when starting the game
      navigate("/spotifylogin");
    }
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <MusicNoteIcon className="nav-icon" />
        <span>Heardle</span>
      </div>

      <nav className="nav">
        <button
          className={`nav-btn ${isActive("/") ? "active" : ""}`}
          onClick={handleHome}
        >
          <HomeIcon className="nav-icon" />
          <span className="nav-label">Home</span>
        </button>

        <button
          className={`nav-btn ${isActive("/gamepage") ? "active" : ""}`}
          onClick={handlePlay}
        >
          <PlayIcon className="nav-icon" />
          <span className="nav-label">Play</span>
        </button>

        <button
          className={`nav-btn ${isActive("/leaderboards") ? "active" : ""}`}
          onClick={() => console.log("TODO: add /leaderboards route")}
        >
          <TrophyIcon className="nav-icon" />
          <span className="nav-label">Leaderboards</span>
        </button>

        {/* Auth button (Login / Logout) */}
        <button
          className={`nav-btn auth-btn ${
            loggedIn ? "auth-logout" : "auth-login"
          }`}
          onClick={handleAuthClick}
        >
          <LogoutIcon className="nav-icon" />
          <span className="nav-label">
            {loggedIn ? "Logout" : "Login"}
          </span>
        </button>
      </nav>
    </aside>
  );
}
