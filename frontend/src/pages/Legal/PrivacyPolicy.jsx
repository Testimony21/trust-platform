import { AlertTriangle } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import "../../components/StaticPage/StaticPage.css";

export default function PrivacyPolicy() {
  return (
    <div className="static-page">
      <section className="static-hero">
        <span className="static-badge">Legal</span>
        <h1>Privacy Policy</h1>
      </section>

      <div className="static-content">
        <p className="static-updated">Draft — not yet reviewed by counsel</p>

        <div className="legal-disclaimer">
          <AlertTriangle size={16} />
          <span>
            This is placeholder text styled to match the site, not a real
            privacy policy. Replace it with language reviewed by a lawyer
            before relying on it — it does not currently reflect your
            actual data practices (what's collected, how it's stored, third
            parties involved, retention periods, etc.).
          </span>
        </div>

        <section className="static-section">
          <h2>1. Information we collect</h2>
          <p>
            [Placeholder] Account details you provide (name, email, phone),
            verification data for identity checks, and activity on the
            platform such as deals, messages, and reports.
          </p>
        </section>

        <section className="static-section">
          <h2>2. How we use it</h2>
          <p>
            [Placeholder] To operate seller verification, calculate trust
            scores, facilitate deals between buyers and sellers, and respond
            to reports or support requests.
          </p>
        </section>

        <section className="static-section">
          <h2>3. Sharing</h2>
          <p>
            [Placeholder] Describe here whether any data is shared with
            third-party identity verification providers, payment
            processors, or analytics tools — and under what terms.
          </p>
        </section>

        <section className="static-section">
          <h2>4. Data retention</h2>
          <p>
            [Placeholder] Specify how long account, deal, and verification
            data is kept, and what happens to it if an account is deleted.
          </p>
        </section>

        <section className="static-section">
          <h2>5. Your rights</h2>
          <p>
            [Placeholder] Cover access, correction, and deletion requests,
            and which regulations apply to your user base (e.g. GDPR,
            NDPR).
          </p>
        </section>

        <section className="static-section">
          <h2>6. Contact</h2>
          <p>[Placeholder] Where users can reach you with privacy questions.</p>
        </section>
      </div>

      <Footer />
    </div>
  );
}