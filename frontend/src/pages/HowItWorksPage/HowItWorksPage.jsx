import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import "../../components/StaticPage/StaticPage.css";

export default function HowItWorksPage() {
  return (
    <div className="static-page">
      <section className="static-hero">
        <span className="static-badge">How It Works</span>
        <h1>
          From search to <span>safe payment.</span>
        </h1>
        <p>
          Four steps stand between "I found a seller" and "I got scammed
          almost happened." Here's how Trust-Platform fills them.
        </p>
      </section>

      <div className="static-content">
        <section className="static-section">
          <div className="step-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div>
                <h3>Search the seller</h3>
                <p>
                  Enter their username, email, or phone number. Trust-Platform
                  looks them up against known verified sellers and past
                  activity.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div>
                <h3>Check their trust score</h3>
                <p>
                  See identity verification status, trust score, and any
                  reports — before you've committed to anything.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div>
                <h3>Start a safe transaction</h3>
                <p>
                  Instead of paying directly, open a deal room. Terms are
                  agreed in writing and both sides confirm before the deal
                  closes.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div>
                <h3>Confirm and review</h3>
                <p>
                  Once you've received what you paid for, confirm completion
                  and leave a review. That review and completed deal both
                  feed into the seller's trust score for the next buyer.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="static-section">
          <h2>If something feels off</h2>
          <p>
            You can report a seller at any point — you don't need to have
            completed a deal with them first. Reports factor into their
            trust score and help the next buyer make an informed call.
          </p>
        </section>

        <div className="static-cta-row">
          <Link to="/verify-seller" className="static-primary">
            <ShieldCheck size={17} />
            Start verifying
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}