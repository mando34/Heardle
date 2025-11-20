import LoginPage from './pages/loginPage';
import CreateAcc from './pages/createAccPage';
import Leaderboard from './pages/leaderboardPage';
import "./css/global.css";
import HomePage from "./pages/homepage";
import GamePage from "./pages/gamepage";
import SpotifyLogin from "./pages/spotifylogin";            // <- your login page
import SpotifyCallback from "./pages/spotifycallback"; // <- you'll create this

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// Small wrapper so we can use useNavigate with your existing props
function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Home: your existing homepage */}
      <Route
        path="/"
        element={
          <HomePage
            onStart={() => {
              // when user presses "single player" or similar
              navigate("/gamepage");
            }}
          />
        }
      />

      {/* Login: connect Spotify */}
      <Route path="/spotifylogin" element={<SpotifyLogin onExit={()=> navigate("/")}/>} />

      {/* Callback: Spotify redirects here with tokens */}
      <Route path="/callback" element={<SpotifyCallback />} />

      {/* Game page: your existing game component */}
      <Route
        path="/gamepage"
        element={
          <GamePage
            onExit={() => {
              // when user wants to go back home
              navigate("/");
            }}
          />
        }
      />

      <Route path="/spotifylogin" element={<SpotifyLogin onExit={()=> navigate("/")}/>} />
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
