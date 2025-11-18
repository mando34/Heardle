import os
import base64
import secrets
import urllib.parse

from flask import Flask, redirect, request, session, jsonify
import requests
from dotenv import load_dotenv
load_dotenv()


# ==========================
# CONFIGURATION
# ==========================

# Load from environment variables (recommended)
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", "YOUR_SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET", "YOUR_SPOTIFY_CLIENT_SECRET")

# This must match exactly what you set in the Spotify Developer Dashboard
# e.g. http://localhost:5000/callback
SPOTIFY_REDIRECT_URI = os.getenv(
    "SPOTIFY_REDIRECT_URI",
    "http://127.0.0.1:5000/callback"
)

# Your React app URL (where the user will end up after login)
# e.g. Vite default: http://localhost:5173
FRONTEND_APP_URL = os.getenv(
    "FRONTEND_APP_URL",
    "http://localhost:5173"
)

# Scopes for your game. You only need read scopes for public content.
SPOTIFY_SCOPES = "user-read-email"  # you can add more if needed

# ==========================
# FLASK APP SETUP
# ==========================

app = Flask(__name__)


app.secret_key = os.getenv("FLASK_SECRET_KEY", "super-secret-dev-key")  # change in production


def get_basic_auth_header():
    """
    Build the Authorization header for Spotify token requests:
    Authorization: Basic base64(client_id:client_secret)
    """
    auth_str = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()
    return {"Authorization": f"Basic {b64_auth_str}"}


# ==========================
# ROUTES
# ==========================

@app.route("/")
def index():
    return jsonify({"status": "ok", "message": "Spotify game backend is running"})


@app.route("/spotifylogin")
def spotifylogin():
    """
    Step 1: Redirect the user to Spotify's Authorization page.
    The frontend should simply open /login in the browser.
    """
    state = secrets.token_urlsafe(16)
    session["spotify_auth_state"] = state

    query_params = {
        "response_type": "code",
        "client_id": SPOTIFY_CLIENT_ID,
        "scope": SPOTIFY_SCOPES,
        "redirect_uri": SPOTIFY_REDIRECT_URI,
        "state": state,
        "show_dialog": "true",  # force Spotify to show account chooser
    }

    url = "https://accounts.spotify.com/authorize?" + urllib.parse.urlencode(query_params)
    return redirect(url)


@app.route("/callback")
def callback():
    """
    Step 2: Spotify redirects here with ?code=...&state=...
    We exchange the code for an access token + refresh token,
    then redirect back to the React app with those tokens in the URL.
    """
    error = request.args.get("error")
    if error:
        return f"Error from Spotify: {error}", 400

    code = request.args.get("code")
    state = request.args.get("state")
    stored_state = session.get("spotify_auth_state")

    if state is None or state != stored_state:
        return "State mismatch. Possible CSRF attack.", 400

    # We don't need state anymore
    session.pop("spotify_auth_state", None)

    # Exchange the authorization code for access + refresh tokens
    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": SPOTIFY_REDIRECT_URI,
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        **get_basic_auth_header(),
    }

    token_res = requests.post(token_url, data=payload, headers=headers)

    if not token_res.ok:
        return f"Failed to get token from Spotify: {token_res.text}", 400

    token_data = token_res.json()
    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")
    expires_in = token_data.get("expires_in")

    # Redirect back to frontend with tokens in query params.
    # In your React app you can parse these from window.location.search
    # and store them in localStorage.
    redirect_params = {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_in": expires_in,
    }

    frontend_redirect_url = f"{FRONTEND_APP_URL}/callback?{urllib.parse.urlencode(redirect_params)}"
    return redirect(frontend_redirect_url)


@app.route("/refresh_token")
def refresh_token():
    """
    Step 3 (optional): The frontend can call /refresh_token?refresh_token=...
    to get a new access token when the old one expires.
    """
    refresh_token = request.args.get("refresh_token")
    if not refresh_token:
        return jsonify({"error": "Missing refresh_token"}), 400

    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        **get_basic_auth_header(),
    }

    token_res = requests.post(token_url, data=payload, headers=headers)
    if not token_res.ok:
        return jsonify({"error": "Failed to refresh token", "details": token_res.text}), 400

    token_data = token_res.json()
    # Spotify may or may not return a new refresh_token; preserve the old one if missing.
    token_data.setdefault("refresh_token", refresh_token)

    return jsonify(token_data)


if __name__ == "__main__":
    # For local dev only
    app.run(host="0.0.0.0", port=8888, debug=True)

