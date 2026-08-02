import { Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import "../../components/StaticPage/StaticPage.css";

export default function Guidelines() {
  return (
    <div className="static-page">
      <section className="static-hero">
        <span className="static-badge">Community Guidelines</span>
        <h1>
          What we expect from <span>everyone here.</span>
        </h1>
        <p>
          Trust scores only mean something if the activity behind them is
          real. These are the ground rules for buyers and sellers using
          Trust-Platform.
        </p>
      </section>

      <div className="static-content">
        <section className="static-section">
          <h2>Do</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="icon-badge">
                <CheckCircle2 size={18} />
              </div>
              <h3>Use safe transactions</h3>
              <p>
                Run deals through the platform's deal room so there's a
                record both sides can point to.
              </p>
            </div>

            <div className="info-card">
              <div className="icon-badge">
                <CheckCircle2 size={18} />
              </div>
              <h3>Leave honest reviews</h3>
              <p>
                Reviews should reflect what actually happened in that
                specific deal — they're what future buyers rely on.
              </p>
            </div>

            <div className="info-card">
              <div className="icon-badge">
                <CheckCircle2 size={18} />
              </div>
              <h3>Report real problems</h3>
              <p>
                Non-delivery, misrepresentation, or bad-faith conduct are
                exactly what reports are for.
              </p>
            </div>
          </div>
        </section>

        <section className="static-section">
          <h2>Don't</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="icon-badge">
                <XCircle size={18} />
              </div>
              <h3>Fake activity</h3>
              <p>
                Creating fake deals, self-reviews, or coordinated reviews to
                inflate a trust score gets accounts removed.
              </p>
            </div>

            <div className="info-card">
              <div className="icon-badge">
                <XCircle size={18} />
              </div>
              <h3>File false reports</h3>
              <p>
                Reports are for real issues — not for settling price
                disagreements or personal disputes.
              </p>
            </div>

            <div className="info-card">
              <div className="icon-badge">
                <XCircle size={18} />
              </div>
              <h3>Take deals off-platform mid-transaction</h3>
              <p>
                If a seller asks to move payment outside Trust-Platform
                after you've started a safe transaction, that's a strong
                warning sign worth reporting.
              </p>
            </div>
          </div>
        </section>

        <section className="static-section">
          <h2>Enforcement</h2>
          <p>
            Verified violations can result in a lowered trust score,
            transaction restrictions, or account removal depending on
            severity. Disagree with an action taken on your account? Use
            the contact page — include the deal ID or seller profile
            involved.
          </p>
        </section>

        <div className="static-cta-row">
          <Link to="/contact" className="static-secondary">
            Contact support
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}