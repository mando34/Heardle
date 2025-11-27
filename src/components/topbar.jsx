// src/components/topbar.jsx
import { SettingsIcon, UsersIcon } from "./icons";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const goToCreateAccount = () => {
    navigate("/createAccPage"); // 👈 this path already exists in App.jsx
  };

  // you can later wire Settings to something else if you want
  const goToSettings = () => {
    // navigate("/settings"); // when you add a settings route
    console.log("Settings clicked");
  };

  return (
    <div className="topbar">
      <div className="settings-btn-wrap">
        <button className="settings-btn" onClick={goToSettings}>
          <SettingsIcon />
        </button>
      </div>
      <div className="avatar-btn-wrap">
        <button className="avatar-btn" onClick={goToCreateAccount}>
          <UsersIcon />
        </button>
      </div>
    </div>
  );
}
