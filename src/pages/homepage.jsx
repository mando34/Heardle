import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import "../css/home.css";

export default function HomePage({ onStart }) {
  return (
    <div className="app-root">
      <Sidebar />

      <main className="main">
        <Topbar />

        <section className="hero-wrap">
          <div className="hero">
            <h1 className="headline">
              <span>Unleash Your Inner Music</span>
              <br />
              <span className="accent">Maestro!</span>
            </h1>

            <p className="tagline">
              Listen, Guess, Compete! Dive into the ultimate song identification
              challenge.
            </p>

            <div className="cta-row">
              <button className="btn btn-primary" onClick={onStart}>Single Player</button>
              <button className="btn btn-ghost">Multiplayer</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
