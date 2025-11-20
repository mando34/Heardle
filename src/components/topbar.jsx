import React from "react";
import { PlayIcon, SettingsIcon, UsersIcon } from "./icons";

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="settings-btn-wrap">
        <button className="settings-btn">
          <SettingsIcon />
        </button>
      </div>
      <div className="avatar-btn-wrap">
        <button className="avatar-btn">
          <UsersIcon />
        </button>
      </div>
    </div>
  );
}
