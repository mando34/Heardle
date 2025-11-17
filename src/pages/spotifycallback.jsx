// src/pages/SpotifyCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const expiresIn = params.get("expires_in");

    if (accessToken) {
      // Store tokens in localStorage (simple approach)
      localStorage.setItem("spotify_access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("spotify_refresh_token", refreshToken);
      }
      if (expiresIn) {
        const expiryTime = Date.now() + Number(expiresIn) * 1000;
        localStorage.setItem("spotify_token_expires_at", expiryTime.toString());
      }

      // Clear the query params from the URL (optional)
      navigate("/game", { replace: true });
    } else {
      // If something went wrong, send them back to login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="app-root">
      <main className="main">
        <p>Finishing Spotify login...</p>
      </main>
    </div>
  );
}
