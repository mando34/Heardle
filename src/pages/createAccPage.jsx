// src/pages/createAccPage.jsx
import "../css/signin.css";
import { LoginIcon } from "../components/icons";
import { useNavigate } from "react-router-dom";

export default function CreateAcc() {
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const goLogin = () => navigate("/loginPage"); // this route exists in App.jsx

  return (
    <div className="signin-bg">
      <div className="signin-card">

        <div className="signinAvatar-spot" aria-hidden>
          <LoginIcon style={{ width: "42px", height: "42px" }} />
        </div>

        <h1 className="signinTitle">Create Account</h1>

        <form className="signinForm" onSubmit={(e) => e.preventDefault()}>
          <label className="signinLabel" htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Create your username"
            className="signinInput"
            autoComplete="username"
            required
            onInvalid={(e) => e.target.setCustomValidity("Please create your username!")}
            onInput={(e) => e.target.setCustomValidity("")}
          />

          <label className="signinLabel" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create your password"
            className="signinInput"
            autoComplete="new-password"
            required
            onInvalid={(e) => e.target.setCustomValidity("Please create your password!")}
            onInput={(e) => e.target.setCustomValidity("")}
          />

          <button className="signinBtn-primary" type="submit">
            Create
          </button>
        </form>

        <button
          className="signinBtn-link"
          type="button"
          onClick={goHome}
        >
          Go Back Home
        </button>

        <button
          className="signinBtn-link"
          type="button"
          onClick={goLogin}
        >
          Login Instead
        </button>

      </div>
    </div>
  );
}
