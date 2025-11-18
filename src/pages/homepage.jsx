import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import "../css/home.css";

export default function HomePage({ onStart }) {
  return (
    <div className="app-root">
      <Sidebar />

      <main className="main">
        <Topbar />

        <section className="home-wrap">
          <div className="home">
            <h1 className="home-headline">
              <span>Unleash Your Inner Music</span>
              <br />
              <span className="home-accent">Maestro!</span>
            </h1>

            <p className="home-tagline">
              Listen, Guess, Compete! Dive into the ultimate song identification
              challenge.
            </p>

            <div className="home-cta-row">
              <button className="btn btn-primary" onClick={onStart}>Start Listening!</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
