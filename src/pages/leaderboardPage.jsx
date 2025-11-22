import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import "../css/leaderboard.css";

/* PLayer info*/
export default function LeaderboardPage({ onStart }) {
  const players = [
    { rank: 1, name: "Cristobal",    score: 15500, winRate: 0.88, avatarClass: "avatar-1" },
    { rank: 2, name: "Piccolo",      score: 67,    winRate: 0.5,  avatarClass: "avatar-1" },
    { rank: 3, name: "David",        score: 67,    winRate: 0.5,  avatarClass: "avatar-1" },
    { rank: 4, name: "anis",         score: 67,    winRate: 0.5,  avatarClass: "avatar-1" },
    { rank: 5, name: "salad finger", score: 67,    winRate: 0.5,  avatarClass: "avatar-1" },
  ];
/* history info*/

  const history = [
    { mode: "Single Player", title: "J-Pop", score: 1200, result: "Win",  time: "2 hours ago" },
    { mode: "Single Player", title: "Indie", score: 1500, result: "Win",  time: "2 days ago" },
    { mode: "Single Player", title: "Rap",   score: 800,  result: "Loss", time: "1 week ago" },
  ];
/* win logic*/

  const getPillClass = (result) =>
    result === "Win"
      ? "historyPill historyPillWin"
      : "historyPill historyPillLoss";

  /* ui */
  const PlayerRow = ({ p }) => (
    <tr>
      <td>{p.rank}</td>

      <td>
        <div className="playerCell">
          <div className={`avatar ${p.avatarClass}`} aria-hidden />
          <span>{p.name}</span>
        </div>
      </td>

      <td>{p.score.toLocaleString()}</td>

      <td>
        <div className="winrateCell">
          <div className="progress">
            <div
              className="progressFill"
              style={{ width: `${p.winRate * 100}%` }}
            />
          </div>
          <span>{Math.round(p.winRate * 100)}%</span>
        </div>
      </td>
    </tr>
  );
  
  const HistoryRow = ({ h }) => (
    <li className="historyRow">
      <div className="historyMain">
        <p className="historyTitle">
          {h.mode}: {h.title}
        </p>
        <span className="historyTime">{h.time}</span>
      </div>

      <div className="historyMeta">
        <span className="historyScore">{h.score.toLocaleString()} Pts</span>
        <span className={getPillClass(h.result)}>{h.result}</span>
      </div>
    </li>
  );

  return (
    <>
      <div className="app-root">
        <Sidebar onStart={onStart} />
          <main className="main">
            <Topbar />
              <section className="leaderboardWrap">
                <div className="leaderboard">
                  {/* leaderboard title */}
                <h1 className="pageTitle">Leaderboard</h1>

                {/* leaderboard cardd */}
                <section className="card">
                  <header className="leaderboardHeader">
                    <div>
                      <h2 className="cardTitle">Global Leaderboard</h2>
                      <p className="cardSubtitle">Top players from around the world.</p>
                    </div>
                  </header>

                  <div className="leaderboardTableWrap">
                    <table className="leaderboardTable">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Player</th>
                          <th>Score</th>
                          <th>Win Rate</th>
                        </tr>
                      </thead>

                      <tbody>
                        {players.map((p) => (
                          <PlayerRow key={p.rank} p={p} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* history title */}
                <h1 className="pageTitle">History</h1>

                {/* history card */}
                <section className="card">
                  <header className="cardHeader">
                    <h3 className="cardTitle">Recent Game History</h3>
                  </header>

                  <ul className="historyList">
                    {history.map((h, i) => (
                      <HistoryRow key={i} h={h} />
                    ))}
                  </ul>
                </section>

                </div>
                
              </section>
            </main>
        
      </div>
    </>
  );
}
