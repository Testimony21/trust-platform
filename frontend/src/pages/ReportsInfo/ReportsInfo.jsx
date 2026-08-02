import { Link } from "react-router-dom";
import { Flag, Eye, ClipboardCheck, ShieldAlert } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import "../../components/StaticPage/StaticPage.css";

export default function ReportsInfo() {
  return (
    <div className="static-page">
      <section className="static-hero">
        <span className="static-badge">Community Reports</span>
        <h1>
          Reporting keeps <span>everyone honest.</span>
        </h1>
        <p>
          If a seller doesn't deliver, disappears, or acts in bad faith, a
          report is how that gets reflected in their trust score — and how
          other buyers get warned before it happens to them.
        </p>
      </section>

      <div className="static-content">
        <section className="static-section">
          <h2>What happens when you report a seller</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="icon-badge">
                <Flag size={18} />
              </div>
              <h3>1. You file it</h3>
              <p>
                From a seller's profile, submit a report describing what
                happened. It's attached to your account, not anonymous.
              </p>
            </div>

            <div className="info-card">
              <div className="icon-badge">
                <Eye size={18} />
              </div>
              <h3>2. It's reviewed</h3>
              <p>
                Reports are checked against the seller's activity — patterns
                across multiple reports carry more weight than a single
                complaint.
              </p>
            </div>

            <div className="info-card">
              <div className="icon-badge">
                <ClipboardCheck size={18} />
              </div>
              <h3>3. Score reflects it</h3>
              <p>
                Verified reports lower a seller's trust score and are shown
                as a report count on their profile.
              </p>
            </div>
          </div>
        </section>

        <section className="static-section">
          <h2>Report responsibly</h2>
          <p>
            Reports carry real weight against a seller's score, so they
            should reflect something that actually happened — non-delivery,
            misrepresentation, refusal to communicate, and similar. Disputes
            over price or personal preference aren't grounds for a report;
            for those, message the seller directly or use a safe transaction
            so payment isn't released until you're satisfied.
          </p>
        </section>

        <section className="static-section">
          <h2>False reports</h2>
          <p>
            Reports filed in bad faith, or used to settle unrelated
            disputes, can be removed and may affect the reporting account.
            The system only works if reports mean something.
          </p>
        </section>

        <div className="static-cta-row">
          <Link to="/verify-seller" className="static-primary">
            <ShieldAlert size={17} />
            Check a seller's report history
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}