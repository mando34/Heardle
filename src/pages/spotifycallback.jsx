// src/pages/spotifycallback.jsx
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
      localStorage.setItem("spotify_access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("spotify_refresh_token", refreshToken);
      }
      if (expiresIn) {
        const expiryTime = Date.now() + Number(expiresIn) * 1000;
        localStorage.setItem(
          "spotify_token_expires_at",
          expiryTime.toString()
        );
      }

      // ✅ Go straight to your game route
      navigate("/", { replace: true });
    } else {
      // ✅ If something broke, go back to login
      navigate("/spotifylogin", { replace: true });
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
