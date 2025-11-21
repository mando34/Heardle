import "./css/global.css";
import HomePage from "./pages/homepage";
import GamePage from "./pages/gamepage";
import GameResults from "./pages/game-results";
import LoginPage from './pages/loginPage';
import CreateAcc from './pages/createAccPage';
import ProfilePage from "./pages/profilepage";
import Leaderboard from './pages/leaderboardPage';
import SpotifyLogin from "./pages/spotifylogin";    
import SpotifyCallback from "./pages/spotifycallback";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// Small wrapper so we can use useNavigate with your existing props
function AppRoutes() {
  const navigate = useNavigate();

  // added to ensure backend stats reset on new game start
  const startGame = async () => {
    await fetch("http://127.0.0.1:8888/reset", {
      method: "POST",
    });
    navigate("/gamepage");
  };

  return (
    <Routes>
      {/* Home: your existing homepage */}
      <Route
        path="/"
        element={
          <HomePage
            onStart={
              // when user presses "single player" or similar
              startGame
            }
          />
        }
      />

      {/*<Route path="/game-results" element={<GamePage onExit={()=> navigate("/")}/>} />*/}
      <Route path="/game-results" element={<GameResults onExit={() => navigate("/")}onStart={startGame}/>} />

      {/* Login: connect Spotify */}
      <Route path="/spotifylogin" element={<SpotifyLogin onExit={()=> navigate("/")}/>} />

      {/* Callback: Spotify redirects here with tokens */}
      <Route path="/callback" element={<SpotifyCallback />} />

      <Route path="/loginPage" element={<LoginPage onExit={()=> navigate("/")}/>} />

      <Route path="/createAccPage" element={<CreateAcc onExit={()=> navigate("/")}/>} />

      <Route path="/leaderboardPage" element={<Leaderboard onExit={()=> navigate("/")}onStart={startGame}/>} />

      <Route path="/profilePage" element={<ProfilePage onExit={()=> navigate("/")}onStart={startGame}/>} />

      <Route
        path="/createAccPage"
        element={<CreateAcc onExit={() => navigate("/")} />}
      />



      {/* Game page: your existing game component */}
      <Route
        path="/gamepage"
        element={
          <GamePage
            onExit={() => {
              // when user wants to go back home
              navigate("/");
              
            }}
            onStart={startGame}
          />
        }
      />
    </Routes>
  );
}

function App() {
  return (
      <Router>
        <AppRoutes />
      </Router>
  );
}

export default App;
