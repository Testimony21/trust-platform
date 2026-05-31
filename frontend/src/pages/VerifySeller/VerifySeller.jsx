import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Lock,
  Search,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./VerifySeller.css";

export default function VerifySeller() {
  return (
    <main className="verify-page">
      <Navbar />

      <section className="verify-shell">
        <Link to="/" className="verify-back">
          Back to home
        </Link>

        <div className="verify-intro">
          <span className="verify-kicker">Seller Trust Check</span>

          <h1>Verify a Seller</h1>

          <p>
            Search with a phone number, email, or username to review trust
            signals before making payment.
          </p>
        </div>

        <div className="verify-layout">
          <form className="verify-form" onSubmit={(event) => event.preventDefault()}>
            <div className="form-heading">
              <h2>Seller details</h2>
              <p>Start with the detail you have. You can add more if needed.</p>
            </div>

            <div className="verify-field">
              <label htmlFor="sellerIdentity">Phone, email, or username</label>
              <div className="verify-input">
                <Search size={19} />
                <input
                  id="sellerIdentity"
                  type="text"
                  placeholder="e.g. 0803 123 4567 or @sellername"
                />
              </div>
            </div>

            <div className="verify-field">
              <label htmlFor="platform">Where did you find them?</label>
              <select id="platform" defaultValue="">
                <option value="" disabled>
                  Select platform
                </option>
                <option>Instagram</option>
                <option>Facebook Marketplace</option>
                <option>WhatsApp</option>
                <option>TikTok</option>
                <option>Website</option>
                <option>Other</option>
              </select>
            </div>

            <div className="verify-field">
              <label htmlFor="notes">Extra details (optional)</label>
              <textarea
                id="notes"
                rows="4"
                placeholder="Add anything that may help the check..."
              />
            </div>

            <button type="submit" className="verify-submit">
              <span>Check Seller</span>
              <ArrowRight size={20} />
            </button>

            <p className="verify-note">
              <Lock size={15} />
              We only use this information to run the seller check.
            </p>
          </form>

          <aside className="verify-side-card">
            <div className="side-icon">
              <ShieldCheck size={30} />
            </div>

            <h2>What happens next?</h2>

            <div className="side-list">
              <div>
                <CheckCircle2 size={20} />
                <span>We look for identity and contact signals.</span>
              </div>

              <div>
                <CheckCircle2 size={20} />
                <span>We check for scam reports or suspicious patterns.</span>
              </div>

              <div>
                <CheckCircle2 size={20} />
                <span>You get a simple trust summary before paying.</span>
              </div>
            </div>

            <div className="sample-result">
              <FileText size={22} />
              <div>
                <strong>Sample result</strong>
                <p>Trust score, risk notes, and a suggested next step.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
