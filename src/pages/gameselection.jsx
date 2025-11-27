import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import CustomAudioPlayer from "../components/customaudioplayer";
import "../css/selection.css";

//auth_bp = Blueprint("game_selection",__name__) ADD LATER

//const BACKEND_URL = "http://127.0.0.1:8888";

export default function SelectionPage() {   
    const navigate = useNavigate();

    const handlePlay = () => {
    // your game route from App.jsx
        navigate("/gamepage");
    };

    const [difficultyOption, setDifficulty] = useState("");
    const handleDifficulty = (event) => {
        setDifficulty(event.target.value);
    };
    const [genreOption, setGenre] = useState("");
    const handleGenre = (event) => {
        setGenre(event.target.value);
    };

  return (
        <div className="app-root">
            <Sidebar />
            
            <main className="main">
                <Topbar />
                
                <section className="select-section">
                    <div className="select-wrap">
                    <div>
                    <h1 className="select-headline">
                    <span>Select game settings</span>
                    </h1>
                    </div>
                    <div className="selection-group">
                            <select value={difficultyOption} 
                                onChange={handleDifficulty}
                                className="selection-dropdown">
                                <option value="">Select difficulty</option>
                                <option value="1">Easy</option>
                                <option value="2">Normal</option>
                                <option value="3">Hard</option>
                            </select>
                    </div>

                    <div className="selection-group">
                            <select value={genreOption} 
                                onChange={handleGenre}
                                className="selection-dropdown">
                                <option value="">Select genre</option>
                                <option value="1">Rock</option>
                                <option value="2">Pop</option>
                                <option value="3">Rap</option>
                                <option value="4">Modern hits</option>
                                <option value="5">Country</option>
                                <option value="6">Blues</option>
                                <option value="7">Indie</option>
                                <option value="8">Classic hits</option>
                            </select>
                    </div>
                    <button className="btn select-btn-primary play" onClick={handlePlay}>Play Game</button>   
                    <div className="input-wrap">

                    </div>

                    </div>
                    

                    
                </section>



            </main>
        </div>

    );

    <button
        className={`nav-btn ${isActive("/gamepage") ? "active" : ""}`}
        onClick={handlePlay}
        >
        <PlayIcon className="nav-icon" />
        <span className="nav-label">Play</span>
    </button>

}