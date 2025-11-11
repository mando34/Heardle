import React from "react";
import "../css/sidebar.css";
import { MusicNoteIcon, HomeIcon, PlayIcon, UsersIcon, TrophyIcon } from "./icons";

/**
 * Reusable Sidebar component
 * - Drop <Sidebar /> into any page/layout where you want the left nav.
 */
export default function Sidebar({ active = "home" }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <MusicNoteIcon className="nav-icon" />
        <span>Heardle</span>
      </div>

      <nav className="nav">
        <button className={`nav-btn ${active === "home" ? "active" : ""}`}>
          <HomeIcon className="nav-icon" />
          <span className="nav-label">Home</span>
        </button>

        <button className={`nav-btn ${active === "single" ? "active" : ""}`}>
          <PlayIcon className="nav-icon" />
          <span className="nav-label">Single Player</span>
        </button>

        <button className={`nav-btn ${active === "multi" ? "active" : ""}`}>
          <UsersIcon className="nav-icon" />
          <span className="nav-label">Multiplayer Lobby</span>
        </button>

        <button className={`nav-btn ${active === "leader" ? "active" : ""}`}>
          <TrophyIcon className="nav-icon" />
          <span className="nav-label">Leaderboards & Profiles</span>
        </button>
      </nav>
    </aside>
  );
}
