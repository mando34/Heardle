import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import "../css/game.css";

export default function GamePage() {
    const [score, setScore] = useState(0);
    const [text, setText] = useState("");
    const guess = (event) => {
        setText(event.target.value);
    }
    const submit = (event) => {
        setScore(score+1);
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
                <p><span>Score: {score}</span></p>
                </h1>
            </div>
        </section>

        <section>
          <div className="now-playing">
              Now Playing
           </div>
            <div>Guess the song from the snippet!</div>
           <div className="audio">
            <audio controls>
            </audio>
           </div>


        </section>


        <section>
            <div className="now-playing">
                Your Guess 
        <form>
            <input
                type = "text"
                value = {text}
                onChange={guess}
                placeholder="Type song title or artist..."
            />
        </form>
            </div>

        </section>


            <button className="btn btn-primary" onClick={submit}>Submit Guess </button>
            <button className="btn btn-ghost">Skip</button>    

        </section>
      </main>
    </div>
  );
}

