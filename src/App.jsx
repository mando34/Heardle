import "./css/global.css";
  import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/homePage";
import GamePage from "./pages/gamepage";
import GameResults from "./pages/gameResultsPage";
import LoginPage from './pages/loginPage';
import CreateAcc from './pages/createAccPage';
import ProfilePage from "./pages/profilePage";
import Leaderboard from './pages/leaderboardPage';
import GameSelectionPage from "./pages/gameselection";
import SpotifyLogin from "./pages/spotifyLogin";    
import SpotifyCallback from "./pages/spotifyCallback";

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
              navigate("/gameSelection");
            }}
          />
        }
      />
      {/* Genre/Difficulty Page */}
      <Route path="/gameSelection" element={ <GameSelectionPage onExit={() => { navigate("/"); }} /> } />      

      {/* Resulst Page */}
      <Route path="/gameResults" element={<GameResults onExit={()=> navigate("/")}/>} />

      {/* Spotify Login Page*/}
      <Route path="/spotifylogin" element={<SpotifyLogin onExit={()=> navigate("/")}/>} />

      {/* Callback: Spotify redirects here with tokens */}
      <Route path="/callback" element={<SpotifyCallback />} />

      {/* Login Page */}
      <Route path="/loginPage" element={<LoginPage onExit={()=> navigate("/")}/>} />

      {/* Create Account Page */}
      <Route path="/createAccPage" element={<CreateAcc onExit={()=> navigate("/")}/>} />

      {/* Leaderboard Page */}
      <Route path="/leaderboardPage" element={<Leaderboard onExit={()=> navigate("/")}/>} />

      {/* Profile Page */}
      <Route path="/profilePage" element={<ProfilePage onExit={()=> navigate("/")}/>} />

      {/* Main Game Page */}
      <Route path="/gamePage" element={<GamePage onExit={() => {navigate("/");}} />}/>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
