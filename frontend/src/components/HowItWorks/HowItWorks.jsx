import {
  ShieldCheck,
  Search,
  BadgeCheck
} from "lucide-react";
import useHowReveal from "../../hooks/useHowReveal";
import "./HowItWorks.css";

export default function HowItWorks() {
  useHowReveal();

  return (
    <section className="how-it-works" id="how-it-works">

      <div className="section-header how-reveal">

        <span className="mini-title">
          HOW IT WORKS
        </span>

        <h2>
          Verify sellers before sending money
        </h2>

        <p>
          Trust-Platform helps buyers identify trusted
          sellers, avoid scams, and make safer online
          transactions.
        </p>

      </div>

      <div className="steps">

        <div className="step-card how-reveal">

          <div className="icon-box">
            <Search size={28} />
          </div>

          <h3>Search Seller</h3>

          <p>
            Enter a seller’s username, email,
            or phone number to begin verification.
          </p>

        </div>

        <div className="step-card how-reveal">

          <div className="icon-box purple how-reveal">
            <ShieldCheck size={28} />
          </div>

          <h3>Check Trust Data</h3>

          <p>
            View trust score, reports,
            verification status, and seller
            history instantly.
          </p>

        </div>

        <div className="step-card how-reveal">

          <div className="icon-box purple how-reveal">
            <BadgeCheck size={28} />
          </div>

          <h3>Trade With Confidence</h3>

          <p>
            Make informed decisions and reduce
            the risk of scams before payment.
          </p>

        </div>

      </div>

    </section>
  );
}