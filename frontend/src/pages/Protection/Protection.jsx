import { Link } from "react-router-dom";
import { ShieldCheck, Lock, MessageSquare, CheckCircle2 } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import "../../components/StaticPage/StaticPage.css";

export default function Protection() {
  return (
    <div className="static-page">
      <section className="static-hero">
        <span className="static-badge">Safe Transactions</span>
        <h1>
          Pay with a <span>buffer</span>, not blind trust.
        </h1>
        <p>
          A safe transaction keeps you and the seller in one place — deal
          details, messages, and confirmation — so payment only moves once
          both sides agree the deal is actually done.
        </p>
      </section>

      <div className="static-content">
        <section className="static-section">
          <h2>How a safe transaction works</h2>
          <div className="step-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div>
                <h3>Start the deal</h3>
                <p>
                  From a seller's trust check, start a transaction. This
                  creates a shared deal room for that specific purchase.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div>
                <h3>Agree on the details</h3>
                <p>
                  Confirm price, item, and terms with the seller directly
                  inside the deal room, so there's a record of what was
                  agreed.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div>
                <h3>Seller accepts</h3>
                <p>
                  The seller accepts the transaction before anything is
                  exchanged, so both sides have explicitly signed off.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div>
                <h3>Both sides confirm completion</h3>
                <p>
                  Once you've received what you paid for, you confirm. The
                  seller confirms too. The deal only closes out when both
                  confirmations are in.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">5</div>
              <div>
                <h3>It counts toward trust</h3>
                <p>
                  A completed deal adds to the seller's history and unlocks
                  a review — which is what moves their trust score.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="static-section">
          <h2>What this protects against</h2>
          <p>
            Safe transactions create a paper trail: what was agreed, when,
            and whether both sides confirmed. That record is what a report
            or dispute gets checked against — instead of it being your word
            against the seller's with no history behind it.
          </p>
        </section>

        <section className="static-section">
          <h2>What it doesn't do</h2>
          <p>
            A safe transaction is a structured, verifiable way to deal with
            a seller — it isn't an automatic refund guarantee for every
            outcome. If something goes wrong, use the deal room record to
            file a report or resolve it with the seller directly; unresolved
            cases can be escalated for review.
          </p>
        </section>

        <div className="static-cta-row">
          <Link to="/verify-seller" className="static-primary">
            <ShieldCheck size={17} />
            Verify a seller
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}