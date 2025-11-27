// src/pages/loginPage.jsx
import "../css/signin.css";
import { LoginIcon } from "../components/icons";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const goCreateAccount = () => navigate("/createAccPage");

  return (
    <div className="signin-bg">
      <div className="signin-card">

        <div className="signinAvatar-spot" aria-hidden>
          <LoginIcon style={{ width: "42px", height: "42px" }} />
        </div>

        <h1 className="signinTitle">Login</h1>

        <form className="signinForm" onSubmit={(e) => e.preventDefault()}>
          <label className="signinLabel" htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            className="signinInput"
            autoComplete="username"
            required
            onInvalid={(e) =>
              e.target.setCustomValidity("Please enter your username!")
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
            onInvalid={(e) =>
              e.target.setCustomValidity("Please enter your password!")
            }
            onInput={(e) => e.target.setCustomValidity("")}
          />

          <button className="signinBtn-primary" type="submit">
            Login
          </button>
        </form>

        {/* Navigation Buttons */}
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
