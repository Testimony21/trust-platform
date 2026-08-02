import { AlertTriangle } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import "../../components/StaticPage/StaticPage.css";

export default function Cookies() {
  return (
    <div className="static-page">
      <section className="static-hero">
        <span className="static-badge">Legal</span>
        <h1>Cookie Policy</h1>
      </section>

      <div className="static-content">
        <p className="static-updated">Draft — not yet reviewed by counsel</p>

        <div className="legal-disclaimer">
          <AlertTriangle size={16} />
          <span>
            Placeholder text. Fill this in based on what your app actually
            sets — auth tokens, analytics, session storage — rather than a
            generic list, since an inaccurate cookie policy can itself be a
            compliance problem.
          </span>
        </div>

        <section className="static-section">
          <h2>1. What we use</h2>
          <p>
            [Placeholder] List actual cookies/local storage used — e.g. auth
            session tokens for login, and any analytics identifiers.
          </p>
        </section>

        <section className="static-section">
          <h2>2. Essential vs. optional</h2>
          <p>
            [Placeholder] Separate cookies required for the app to function
            (login sessions) from optional ones (analytics, marketing) and
            explain what happens if optional ones are declined.
          </p>
        </section>

        <section className="static-section">
          <h2>3. Managing preferences</h2>
          <p>
            [Placeholder] Explain how users can control or clear cookies,
            and whether you have a cookie consent banner.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}