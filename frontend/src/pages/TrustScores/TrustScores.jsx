import { Link } from "react-router-dom";
import { ShieldCheck, TrendingUp, UserCheck, MessageSquareWarning } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import "../../components/StaticPage/StaticPage.css";

export default function TrustScores() {
  return (
    <div className="static-page">
      <section className="static-hero">
        <span className="static-badge">How Scoring Works</span>
        <h1>
          Trust Scores, <span>explained.</span>
        </h1>
        <p>
          Every seller on Trust-Platform carries a score from 0–100%. It isn't
          a guess — it's built from verifiable activity on the platform, and
          it moves as that activity changes.
        </p>
      </section>

      <div className="static-content">
        <section className="static-section">
          <h2>What goes into it</h2>
          <p>
            A trust score reflects a seller's track record on Trust-Platform,
            not a claim about who they are outside of it. It's built from a
            few signals working together, weighted toward things that are
            hard to fake.
          </p>

          <div className="info-grid">
            <div className="info-card">
              <div className="icon-badge">
                <UserCheck size={18} />
              </div>
              <h3>Identity verification</h3>
              <p>
                Confirmed email, phone, and — for verified sellers — a
                government ID check. This is the starting layer, not the
                whole score.
              </p>
            </div>

            <div className="info-card">
              <div className="icon-badge">
                <TrendingUp size={18} />
              </div>
              <h3>Completed deals</h3>
              <p>
                Each transaction that both buyer and seller confirm as
                complete adds to the seller's history. Score rises with
                every successful deal.
              </p>
            </div>

            <div className="info-card">
              <div className="icon-badge">
                <MessageSquareWarning size={18} />
              </div>
              <h3>Reviews &amp; reports</h3>
              <p>
                Buyer reviews after a completed deal, and any reports filed
                against a seller, both factor into the score over time.
              </p>
            </div>
          </div>
        </section>

        <section className="static-section">
          <h2>Why a new seller starts at 0%</h2>
          <p>
            A 0% score doesn't mean a seller has done anything wrong — it
            means they don't have a track record on the platform yet. New
            sellers are shown distinctly from sellers with a poor history,
            because "no data" and "bad data" aren't the same thing.
          </p>
          <p>
            The score rises the same way for everyone: by completing deals
            through Trust-Platform and getting reviewed.
          </p>
        </section>

        <section className="static-section">
          <h2>What it doesn't guarantee</h2>
          <p>
            A high trust score means a seller has a strong history on this
            platform — it isn't a promise of outcome for any single
            transaction. That's why every deal, regardless of score, can be
            run through a safe transaction so your payment isn't released
            until both sides confirm.
          </p>
        </section>

        <div className="static-cta-row">
          <Link to="/verify-seller" className="static-primary">
            <ShieldCheck size={17} />
            Check a seller now
          </Link>
          <Link to="/protection" className="static-secondary">
            How safe transactions work
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}