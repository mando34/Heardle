// src/pages/loginPage.jsx
import "../css/signin.css";
import { LoginIcon } from "../components/icons";
import { useNavigate } from "react-router-dom";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8888'; // use Vite env or fallback to backend

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");      // treat this as email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const goHome = () => navigate("/");
  const goCreateAccount = () => navigate("/createAccPage");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,                       // backend expects "email"
          password: btoa(password),    // base64 encode for backend
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Use AuthContext to persist login
      login(email, data.user_id, data.token);

      // Redirect to home
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Fetch error:", err);
      console.error("API_BASE:", API_BASE);
      setError(`Network error: ${err.message || "please try again."}`);
    }
  };

  return (
    <div className="signin-bg">
      <div className="signin-card">

        <div className="signinAvatar-spot" aria-hidden>
          <LoginIcon style={{ width: "42px", height: "42px" }} />
        </div>

        <h1 className="signinTitle">Login</h1>

        <form className="signinForm" onSubmit={handleSubmit}>
          <label className="signinLabel" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            className="signinInput"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onInvalid={(e) =>
              e.target.setCustomValidity("Please enter your email!")
            }
            onInput={(e) => e.target.setCustomValidity("")}
          />

          <label className="signinLabel" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            className="signinInput"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onInvalid={(e) =>
              e.target.setCustomValidity("Please enter your password!")
            }
            onInput={(e) => e.target.setCustomValidity("")}
          />

          <button className="signinBtn-primary" type="submit">
            Login
          </button>
        </form>

        {error && <p className="signinError">{error}</p>}

        <button className="signinBtn-link" type="button" onClick={goHome}>
          Return Homepage
        </button>

        <button
          className="signinBtn-link"
          type="button"
          onClick={goCreateAccount}
        >
          Create account
        </button>

      </div>
    </div>
  );
}
