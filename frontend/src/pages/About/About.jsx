import { Link } from "react-router-dom";
import { ShieldCheck, Users, Target } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import "../../components/StaticPage/StaticPage.css";

export default function About() {
  return (
    <div className="static-page">
      <section className="static-hero">
        <span className="static-badge">About Trust-Platform</span>
        <h1>
          Built for the gap between <span>"pay first"</span> and{" "}
          <span>"trust me."</span>
        </h1>
        <p>
          Most online scams happen in that gap — a seller you've never dealt
          with, asking for payment before you've seen anything real.
          Trust-Platform exists to close it.
        </p>
      </section>

      <div className="static-content">
        <section className="static-section">
          <h2>What we do</h2>
          <p>
            Trust-Platform lets buyers check a seller's identity, trust
            score, and report history before sending any money, and gives
            both sides a structured way to run the transaction itself — so
            trust isn't something you have to take on faith.
          </p>
        </section>

        <div className="info-grid">
          <div className="info-card">
            <div className="icon-badge">
              <Target size={18} />
            </div>
            <h3>Our focus</h3>
            <p>
              Reducing scam risk in peer-to-peer online transactions,
              starting with the moment before payment happens.
            </p>
          </div>

          <div className="info-card">
            <div className="icon-badge">
              <Users size={18} />
            </div>
            <h3>Who it's for</h3>
            <p>
              Buyers and sellers dealing with each other outside of a
              marketplace's built-in protections — social media, classifieds,
              direct messages.
            </p>
          </div>

          <div className="info-card">
            <div className="icon-badge">
              <ShieldCheck size={18} />
            </div>
            <h3>How we measure trust</h3>
            <p>
              Verifiable activity — identity checks, completed deals, and
              reviews — not self-reported claims.
            </p>
          </div>
        </div>

        <section className="static-section" style={{ marginTop: 56 }}>
          <h2>Where we're headed</h2>
          <p>
            Trust-Platform is early. The core loop — verify, deal safely,
            build history — is live today, and it grows from here based on
            where buyers and sellers actually run into risk.
          </p>
        </section>

        <div className="static-cta-row">
          <Link to="/verify-seller" className="static-primary">
            Try a seller check
          </Link>
          <Link to="/how-it-works" className="static-secondary">
            See how it works
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}