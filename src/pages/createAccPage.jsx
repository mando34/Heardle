import "../css/signin.css";
import {LoginIcon} from "../components/icons";

export default function CreateAcc() {
  return (
    <div className="signin-bg">
      <div className="signin-card">

        <div className="signinAvatar-spot" aria-hidden>
          {/* <UserIcon /> */}
          <LoginIcon style={{ width: "42px", height: "42px" }} />
        </div>

        <h1 className="signinTitle">Create Account</h1>

        {/* <Username /> */}
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
            onInvalid={(e) => e.target.setCustomValidity('Please create your username!')}
            onInput={(e) => e.target.setCustomValidity('')}
          />

          {/* <Password /> */}
          <label className="signinLabel" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create your password"
            className="signinInput"
            autoComplete="new-password"
            required
            onInvalid={(e) => e.target.setCustomValidity('Please create your password!')}
            onInput={(e) => e.target.setCustomValidity('')}
          />

          {/* <Button login, return, and create /> */}
          <button className="signinBtn-primary" type="submit">Create</button>
        </form>

        <button className="signinBtn-link" type="button">
          Return Homepage
        </button>

        <button className="signinBtn-link" type="button">
          Return Login
        </button>

      </div>
    </div>
  );
}
