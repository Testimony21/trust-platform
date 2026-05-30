import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import heroLogo from "../../assets/images/hero.png";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import WhyTrust from "../../components/WhyTrust/WhyTrust";
import Footer from "../../components/Footer/Footer";

export default function Home() {
  return (
    <div className="home">

      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">

        {/* LEFT */}
        <div className="hero-left">

          <span className="badge">Secure Buyer–Seller Verification</span>

          <h1>
            Verify Sellers <span>Before You Pay</span>
          </h1>

          <p>
            Trust Platform helps you verify sellers, detect scams,
            and confirm identities before making any transaction online.
          </p>

          <div className="cta">
            <button className="primary">Start Verification</button>
            <button className="secondary">How it works</button>
          </div>

          <div className="stats">
            <div>
              <h3>10k+</h3>
              <span>Sellers Checked</span>
            </div>

            <div>
              <h3>95%</h3>
              <span>Scam Detection Rate</span>
            </div>

            <div>
              <h3>Fast</h3>
              <span>Instant Verification</span>
            </div>
          </div>

        </div>

        <div className="hero-logo-bg" aria-hidden="true">
          <img src={heroLogo} alt="" />
        </div>

        {/* RIGHT */}
        {/* <div className="hero-right">

          <div className="card preview-card">

            <h3>Trust Check Preview</h3>

            <p className="subtext">
              Before you pay anyone:
            </p>

            <ul className="checklist">
              <li>✔ Check Identity</li>
              <li>✔ View Seller History</li>
              <li>✔ See Trust Score</li>
            </ul>

            <p className="warning-text">
              Avoid scams instantly
            </p>

            <div className="footer-note">
              We help you verify before payment
            </div>

          </div>


        </div> */}


      </section >

      <HowItWorks />

      <WhyTrust />

      <Footer />

    </div >
  );
}