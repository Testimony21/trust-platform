import "./Footer.css";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn
} from "react-icons/fa";
import useReveal from "../../hooks/useReveal";
import logo from "../../assets/images/new-logo.png";  
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

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

        <Link to="/verify-seller" className="footer-btn reveal">
          Get Started
        </Link>

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

            <Link to="/verify-seller">Verify Seller</Link>
            <Link to="/trust-scores">Trust Scores</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/protection">Protection</Link>
          </div>

          <div>
            <h4>Company</h4>

            <Link to="/about">About</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/careers">Careers</Link>
          </div>

          <div>
            <h4>Legal</h4>

            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/guidelines">Guidelines</Link>
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