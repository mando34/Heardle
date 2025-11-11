import React from "react";
import { PlayIcon, SettingsIcon } from "./icons";

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="chip">
        <PlayIcon /> <span>Play</span>
      </div>
      <button className="icon-btn" title="Settings">
        <SettingsIcon />
      </button>
      <div className="avatar" title="Account" />
    </div>
  );
}
