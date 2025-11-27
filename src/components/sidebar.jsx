// src/components/sidebar.jsx
import React, { useContext } from "react";
import "../css/sidebar.css";
import {
  MusicNoteIcon,
  HomeIcon,
  PlayIcon,
  LogoutIcon,
  TrophyIcon,
} from "./icons";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const handleHome = () => {
    navigate("/");
  };

  const handlePlay = () => {
    navigate("/gameselection");
  };

  const handleLeaderboard = () => {
    navigate("/leaderboardPage");
  };

  const handleAuthClick = () => {
    if (user) {
      // Logged in: logout
      logout();
      navigate("/");
    } else {
      // Not logged in: go to login page
      navigate("/loginPage");
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
          onClick={handleLeaderboard}
        >
          <TrophyIcon className="nav-icon" />
          <span className="nav-label">Leaderboards</span>
        </button>

        {/* Auth button (Login / Logout) */}
        <button
          className={`nav-btn auth-btn ${
            user ? "auth-logout" : "auth-login"
          }`}
          onClick={handleAuthClick}
          title={user ? `Logged in as ${user.email}` : "Not logged in"}
        >
          <LogoutIcon className="nav-icon" />
          <span className="nav-label">
            {user ? "Logout" : "Login"}
          </span>
        </button>
      </nav>
    </aside>
  );
}
