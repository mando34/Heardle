// src/components/topbar.jsx
import { SettingsIcon, UsersIcon } from "./icons";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Topbar() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const goToProfilePage = () => {
    navigate("/profilePage");
  };

  const goToCreateAccount = () => {
    navigate("/createAccPage");
  };

  const goToSettings = () => {
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
        {user ? (
          <button 
            className="avatar-btn logged-in" 
            onClick={goToProfilePage} 
            title={`Logged in as ${user.email}`}
          >
            <UsersIcon />
          </button>
        ) : (
          <button className="avatar-btn" onClick={goToCreateAccount}>
            <UsersIcon />
          </button>
        )}
      </div>
    </div>
  );
}
