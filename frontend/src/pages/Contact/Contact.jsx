import { useState } from "react";
import { Mail, MessageCircle, Clock, Send } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import "../../components/StaticPage/StaticPage.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    // NOTE: no backend endpoint exists yet for contact submissions —
    // this just confirms locally. Wire this up to a real /api/contact
    // route (or a mailto/email service) once one exists.
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="static-page">
      <section className="static-hero">
        <span className="static-badge">Get in touch</span>
        <h1>
          Questions, issues, <span>or feedback?</span>
        </h1>
        <p>
          Whether it's a seller dispute, a bug, or something you think we
          should build — this goes straight to us.
        </p>
      </section>

      <div className="static-content">
        <div className="contact-grid">
          <div>
            <div className="contact-info-item">
              <div className="icon-badge">
                <Mail size={18} />
              </div>
              <div>
                <h4>Email</h4>
                <p>support@trust-platform.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="icon-badge">
                <MessageCircle size={18} />
              </div>
              <div>
                <h4>Dispute or report follow-up</h4>
                <p>
                  Include the seller's profile link or deal ID so we can
                  find it quickly.
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="icon-badge">
                <Clock size={18} />
              </div>
              <div>
                <h4>Response time</h4>
                <p>Usually within 1–2 business days.</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {sent && (
              <div className="contact-success">
                Message received — we'll get back to you soon.
              </div>
            )}

            <label>
              Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Message
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What's going on?"
                rows={5}
                required
              />
            </label>

            <button type="submit" className="static-primary">
              <Send size={16} />
              Send message
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}