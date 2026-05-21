import "./WhyTrust.css";

import {
  Shield,
  ScanSearch,
  Siren,
  BadgeCheck
} from "lucide-react";
import useReveal from "../../hooks/useReveal";

export default function WhyTrust() {
  useReveal();
  return (

    <section className="why-trust reveal" id="why reveal">

  {/* LEFT */}
  <div className="why-left reveal">

    <span className="mini-title">
      WHY TRUSTPLATFORM
    </span>

    <h2>
      Verify before you pay.
    </h2>

    <p className="main-text">
      We help buyers identify trustworthy sellers
      before payment is made using identity checks,
      trust scores, transaction signals, and scam reports.
    </p>

    <div className="feature-list">

      <div className="feature-item">
        <Shield />
        <div>
          <h3>Identity Verification</h3>
          <p>
            Confirm sellers before making payment.
          </p>
        </div>
      </div>

      <div className="feature-item">
        <ScanSearch />
        <div>
          <h3>Seller History</h3>
          <p>
            View trust records and verification signals.
          </p>
        </div>
      </div>

      <div className="feature-item">
        <BadgeCheck />
        <div>
          <h3>Trust Scores</h3>
          <p>
            Understand seller credibility instantly.
          </p>
        </div>
      </div>

    </div>

  </div>

  {/* RIGHT */}
  <div className="why-right reveal">

    <div className="trust-preview">

      <div className="preview-top">
        <span className="live-dot"></span>
        Live Seller Analysis
      </div>

      <div className="score-ring">

        <div className="inner-score">
          <h1>92%</h1>
          <span>Trust Score</span>
        </div>

      </div>

      <div className="preview-details">

        <div>
          <strong>Identity</strong>
          <span>Verified</span>
        </div>

        <div>
          <strong>Transactions</strong>
          <span>28 Successful Deals</span>
        </div>

        <div>
          <strong>Risk Level</strong>
          <span className="safe">
            Low Risk
          </span>
        </div>

      </div>

    </div>

  </div>

</section>
  );
}