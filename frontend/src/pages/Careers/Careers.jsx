import { Mail, Briefcase } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import "../../components/StaticPage/StaticPage.css";

export default function Careers() {
  return (
    <div className="static-page">
      <section className="static-hero">
        <span className="static-badge">Careers</span>
        <h1>
          We're not <span>actively hiring</span> right now.
        </h1>
        <p>
          Trust-Platform is early-stage and growing. There's nothing open at
          the moment, but that changes — check back, or reach out if you
          think there's a fit worth starting a conversation about.
        </p>
      </section>

      <div className="static-content">
        <section className="static-section">
          <div className="info-grid">
            <div className="info-card">
              <div className="icon-badge">
                <Briefcase size={18} />
              </div>
              <h3>No open roles</h3>
              <p>
                We'll post here as soon as that changes. There's no roles
                list to browse yet.
              </p>
            </div>

            <div className="info-card">
              <div className="icon-badge">
                <Mail size={18} />
              </div>
              <h3>Reach out anyway</h3>
              <p>
                If you're set on working on trust and safety for online
                transactions, send a note through the contact page.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}