import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import "../css/home.css";

import { MusicNoteIcon, HomeIcon, PlayIcon, UsersIcon, TrophyIcon } from "../components/icons";

export default function ProfilePage() {

  const username = "MelodyMaster_X";
  const rank = 12;
  const totalPoints = 12500;
  const winRate = 75;

  return (
    <div className="app-root">
      <Sidebar />

      <main className="main" style={{ width: "100%" }}>
        <Topbar />

        <section className="hero-wrap" style={{ width: "100%" }}>
          <div className="hero" >

            <div align="center">
              <div className="avatar" style={{ width: "100px", height: "100px" }} title="User Profile"/>
            </div>    

            <br></br>        

            <div className="headline">
              {username.toLocaleString()}
              <div className="tagline">Pro Musician</div>
            </div>
            
            <div align="center">
              <div className="chip" style={{ display: "inline-flex" }}>
                Rank #{rank.toLocaleString()}</div>
            </div>

            <br></br>

            <div className="cta-row">
              <div>
                <div><strong>{totalPoints.toLocaleString()}</strong></div>
                <div>Total Points</div>
              </div>

              <div>
                <div><strong>{winRate}%</strong></div>
                <div>Win Rate</div>
              </div>
            </div>

            <br></br>

            <div>
              <button className="pill-btn btn-primary">View My Stats</button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
} 