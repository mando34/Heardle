import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import "../css/home.css";
import "../css/profile.css";

import { MusicNoteIcon, HomeIcon, PlayIcon, UsersIcon, TrophyIcon } from "../components/icons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8888'; // use Vite env or fallback to backend

export default function ProfilePage() {

  const { auth } = useContext(AuthContext);

  //let _username = "MelodyMaster_X";
  //let _firstname = "John";
  //let _lastname = "Doe";

  const rank = 12; // <<< Might not use this.

  const[winRate, setWinRate] = useState(0);
  const[totalPoints, setTotalPoints] = useState(0);

  const [user, setUser] = useState(""); // <<< Don't remove!

  const [username, setUsername] = useState("username");
  const [firstname, setFirstname] = useState("firstname");
  const [lastname, setLastname] = useState("lastname");
  const [total_games, setTotalgames] = useState(0);
  const [total_wins, setTotalwins] = useState(0);
  const [cumulative_score, setCumulativescore] = useState(0);

  // Get current Profile info at the start:
  useEffect(() => {
    async function loadProfile() {

      // Get current user ID
      let id = parseInt(localStorage.getItem('user_id'));

      // Fetch profile data from backend
      const res = await fetch(`${API_BASE}/getProfile?user_id=${id}`);
      const data = await res.json();

      // Set profile data to state variables
      setUser(data);
      setUsername(data.gametag);
      setFirstname(data.first_name);
      setLastname(data.last_name);

      setTotalgames(data.total_games);
      setTotalwins(data.total_wins);
      setCumulativescore(data.cumulative_score);

      // Calculate win rate and total points
      let rate = total_games > 0 ? Math.round((total_wins / total_games) * 100) : 0;
      let points = cumulative_score;

      // Update Profile stats
      setWinRate(rate);
      setTotalPoints(points);

      console.log("Profile data:", data);
      console.log("Win Rate:", winRate);
      console.log("Total Points:", totalPoints);
    }
    loadProfile();
  }, []);

  // Update current Profile info:
  async function updateProfile() {

    console.log("Updating profile to:", { username, firstname, lastname });

    // Get current user ID
    let id = parseInt(localStorage.getItem('user_id'));

    // Give the updated values of U_ID, gametag, first_name, last_name to backend:
    const res = await fetch(`${API_BASE}/setProfile?user_id=${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: id,
      gametag: username,
      first_name: firstname,
      last_name: lastname
    })
  });

  const data = await res.json();
  console.log("Update result:", data);

    console.log("Profile updated:", { username, firstname, lastname });
  }  

  return (
    <div className="app-root">
      <Sidebar />

      <main className="main" style={{ width: "100%" }}>
        <Topbar />

        <section className="profile-section">
          <div className="card px-4 py-12" style={{ maxWidth: "600px", margin: "0 auto" }}>
            
            {/* Avatar */}
            <div align="center">
              <div className="avatar" style={{ width: "100px", height: "100px" }} title="User Profile"/>
            </div>    

            <br></br> 

            {/* Rank Chip */}
            <div align="center">
                <div className="tagline" align="center">Pro Musician</div>
                <div className="chip" style={{ display: "inline-flex" }}>
                  Rank #{rank.toLocaleString()}</div>
              </div>       

            <br></br>

            {/* Stats Row */}
            <div className="cta-grid" align="center" style={{gap: "0px"}}>
              <div className="cta-cell">
                <div><strong>{totalPoints.toLocaleString()}</strong></div>
                <div>Total Points</div>
              </div>

              <div className="cta-cell">
                <div><strong>{winRate}%</strong></div>
                <div>Win Rate</div>
              </div>
            </div>

            <br></br>

            <div >
              {/* Username */} 
              <div className="headline">
                <label htmlFor="username" className="profile-text">Gamertag</label>
                <input id="username" type="text" className="profile-input" style={{ width: "100%"}} value={username} placeholder="MelodyMaster_X" onChange={(e) => setUsername(e.target.value)}></input>
              </div>

              <br></br>        

              {/* First and Last Name */}
              <div className="cta-grid" >
                  <div className="cta-cell">
                  <label htmlFor="firstname" className="profile-text">First Name</label>
                  <input id="firstname" type="text" className="profile-input" style={{display: "block"}} value={firstname} placeholder="John" onChange={(e) => setFirstname(e.target.value)}></input>
                  </div>

                  <div className="cta-cell">    
                  <label htmlFor="lastname" className="profile-text">Last Name</label>
                  <input id="lastname" type="text" className="profile-input" style={{display: "block"}} value={lastname} placeholder="Doe" onChange={(e) => setLastname(e.target.value)}></input>
                  </div>
              </div>
            </div>

            <br></br>

            {/* Stats Row */}
            

            <br></br>

            <div className="cta-grid" align="center" style={{gap: "0px"}}>
                <div className="cta-cell">
                  <button className="pill-btn stats-btn">View My Stats</button>
                </div>
                <div className="cta-cell">
                  <button className="pill-btn apply-btn" onClick={updateProfile}>Apply Changes</button>
                </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
} 