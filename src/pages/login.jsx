// src/pages/login.jsx
const BACKEND_URL = "http://127.0.0.1:8888"; // <-- changed port

export default function Login() {
  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/login`;
  };

  return (
    <div className="app-root">
      <main className="main">
        <section className="hero-wrap">
          <h1 className="headline">
            <span>Connect your Spotify</span>
          </h1>
          <p>Log in with Spotify to play the music guessing game.</p>

          <button className="btn btn-primary" onClick={handleLogin}>
            Login with Spotify
          </button>
        </section>
      </main>
    </div>
  );
}
