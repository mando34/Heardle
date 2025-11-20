// src/pages/login.jsx
import '../css/spotifylogin.css';
const BACKEND_URL = "http://127.0.0.1:8888"; // <-- changed port

export default function SpotifyLogin({onExit}) {
  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/spotifylogin`;
  };


  return (
      <div className="spotify-main">
        <section className="spotify-wrap">
          <div className="backbtn-wrap">
            <button className="btn btn-primary backbtn" onClick={onExit}>Back</button>
          </div>
          <h1 className="spotify-headline">
            <span>Connect your Spotify</span>
          </h1>
          <p>Log in with Spotify to play Heardle</p>

          <button className="btn btn-primary loginbtn" onClick={handleLogin}>
            Login with Spotify
          </button>
        </section>
      </div>
  );
}
