import "./Footer.css";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn
} from "react-icons/fa";
import useReveal from "../../hooks/useReveal";
import logo from "../../assets/images/bg-logo.png";  
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  useReveal();

  return (
    <footer className="footer reveal">

      {/* TOP CTA */}
      <div className="footer-cta reveal">

        <div className="footer-cta-text reveal">

          <span className="mini-title reveal">
            START VERIFYING
          </span>

          <h2>
            Verify before you pay.
          </h2>

          <p>
            Verify sellers, check trust signals,
            and reduce scam risks before sending money online.
          </p>

        </div>

        <button className="footer-btn reveal">
          Get Started
        </button>

      </div>

      {/* MAIN */}
      <div className="footer-main reveal">

        {/* LEFT */}
        <div className="footer-brand">

          <div className="brand-logo">
            <img src={logo} alt="Trust-Platform Logo" />
            {/* <span>TrustPlatform</span> */}
          </div>

          <p>
            Helping buyers verify sellers, avoid scams,
            and make safer online transactions with confidence.
          </p>

          <div className="socials">

            <a href="/">
              <FaTwitter />
            </a>

            <a href="/">
              <FaInstagram />
            </a>

            <a href="/">
              <FaFacebookF />
            </a>

            <a href="/">
              <FaLinkedinIn />
            </a>

          </div>

        </div>

        {/* RIGHT */}
        <div className="footer-links reveal">

          <div>
            <h4>Platform</h4>

            <a href="/">Verify Seller</a>
            <a href="/">Trust Scores</a>
            <a href="/">Reports</a>
            <a href="/">Protection</a>
          </div>

          <div>
            <h4>Company</h4>

            <a href="/">About</a>
            <a href="/">How It Works</a>
            <a href="/">Contact</a>
            <a href="/">Careers</a>
          </div>

          <div>
            <h4>Legal</h4>

            <a href="/">Privacy Policy</a>
            <a href="/">Terms</a>
            <a href="/">Cookies</a>
            <a href="/">Guidelines</a>
          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom reveal">

        <p>
          © 2026 TrustPlatform. All rights reserved.
        </p>

        <span>
          Built for safer online transactions.
        </span>

      </div>

    </footer>
  );
}