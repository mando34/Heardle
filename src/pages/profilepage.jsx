import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import "../css/home.css";

export default function ProfilePage() {
  return (
    <div className="app-profile">
      <Sidebar />

      <main className="profile">
        <Topbar />

        <section className="hero-wrap">
          <div className="circle">

          </div>

          <div className="hero">
            <h1 className="headline">
              <span>Profile</span>
              <br />
              <span className="accent">John Dickson!</span>
            </h1>

            <p className="tagline">
              Listen, Guess, Compete! Dive into the ultimate song identification
              challenge.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
