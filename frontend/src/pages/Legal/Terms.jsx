import { AlertTriangle } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import "../../components/StaticPage/StaticPage.css";

export default function Terms() {
  return (
    <div className="static-page">
      <section className="static-hero">
        <span className="static-badge">Legal</span>
        <h1>Terms of Service</h1>
      </section>

      <div className="static-content">
        <p className="static-updated">Draft — not yet reviewed by counsel</p>

        <div className="legal-disclaimer">
          <AlertTriangle size={16} />
          <span>
            Placeholder text, not a binding terms-of-service document. This
            needs legal review before launch — especially the sections on
            liability for seller disputes and safe-transaction outcomes,
            since those carry real legal weight for a platform like this.
          </span>
        </div>

        <section className="static-section">
          <h2>1. Using Trust-Platform</h2>
          <p>
            [Placeholder] By creating an account, you agree to provide
            accurate information and use the platform for legitimate
            buyer/seller verification and transactions.
          </p>
        </section>

        <section className="static-section">
          <h2>2. Trust scores &amp; verification</h2>
          <p>
            [Placeholder] Trust scores reflect platform activity and are not
            a guarantee of a seller's conduct. State clearly here that
            Trust-Platform does not warrant any individual transaction
            outcome.
          </p>
        </section>

        <section className="static-section">
          <h2>3. Safe transactions</h2>
          <p>
            [Placeholder] Define what "safe transaction" legally commits
            Trust-Platform to — this is the section most likely to create
            liability if it overpromises. Get this reviewed carefully.
          </p>
        </section>

        <section className="static-section">
          <h2>4. Reports &amp; account actions</h2>
          <p>
            [Placeholder] Explain what happens to accounts with verified
            reports, and the process for disputing a report.
          </p>
        </section>

        <section className="static-section">
          <h2>5. Limitation of liability</h2>
          <p>
            [Placeholder] Standard liability limitation language — must be
            drafted by counsel, not generated here.
          </p>
        </section>

        <section className="static-section">
          <h2>6. Changes to these terms</h2>
          <p>[Placeholder] How and when updates to these terms take effect.</p>
        </section>
      </div>

      <Footer />
    </div>
  );
}