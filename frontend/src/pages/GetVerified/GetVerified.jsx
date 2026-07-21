import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import axios from "axios";
import "./GetVerified.css";

export default function GetVerified() {
  const { token, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState("Not Submitted");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
    bio: "",
    instagram: "",
    facebook: "",
    website: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.displayName.trim()) {
      setError("Display name is required.");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/seller/create`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus("Pending Review");
      setSuccess(true);
      setFormData({
        displayName: "",
        phone: "",
        bio: "",
        instagram: "",
        facebook: "",
        website: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Wait for auth
  if (authLoading) return null;

  // Gate — must be logged in
  if (!user) {
    return (
      <div className="verify-page">
        <div className="verify-gate">
          <h2>Sign in to get verified</h2>
          <p>You need an account to apply for seller verification.</p>
          <div className="verify-gate-actions">
            <Link to="/register" className="primary">Create account</Link>
            <Link to="/login" className="secondary">Log in</Link>
          </div>
        </div>
      </div>
    );
  }

  // Gate — must be a seller
  if (user.role !== "seller") {
    return (
      <div className="verify-page">
        <div className="verify-gate">
          <h2>Sellers only</h2>
          <p>This page is for seller accounts. You're logged in as a buyer.</p>
          <Link to="/dashboard" className="primary" style={{ marginTop: "16px", display: "inline-flex", padding: "12px 20px", borderRadius: "10px", textDecoration: "none", justifyContent: "center" }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-page">
      <div className="verify-container">

        {/* LEFT */}
        <div className="verify-info">
          <Link to="/dashboard" className="verify-back">
            <ChevronLeft size={16} /> Back to dashboard
          </Link>

          <span className="verify-badge">TRUST PLATFORM</span>

          <h1>Become a Verified Seller</h1>

          <p>
            Increase buyer confidence, improve your trust score,
            and stand out from unverified sellers.
          </p>

          <div className="benefits">
            <div className="benefit">
              <h3>✓ Verified Badge</h3>
              <p>Show buyers that your identity has been reviewed.</p>
            </div>
            <div className="benefit">
              <h3>✓ Higher Trust Score</h3>
              <p>Build credibility and improve visibility.</p>
            </div>
            <div className="benefit">
              <h3>✓ Buyer Confidence</h3>
              <p>Help buyers feel safer before payment.</p>
            </div>
          </div>

          <div className="status-card">
            <span>Verification Status</span>
            <h3 className={status === "Pending Review" ? "status-pending" : ""}>
              {status}
            </h3>
          </div>
        </div>

        {/* RIGHT */}
        <div className="verify-form-card">
          <h2>Verification Details</h2>
          <p className="form-sub">
            Fill in your details below. Our team will review your submission.
          </p>

          {/* SUCCESS STATE */}
          {success ? (
            <div className="verify-success">
              <CheckCircle2 size={40} />
              <h3>Submitted successfully</h3>
              <p>
                Your verification request is under review.
                We'll notify you once it's been processed.
              </p>
              <button onClick={() => navigate("/dashboard")} className="verify-form-card button">
                Back to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="verify-form-error">{error}</div>}

              <div className="form-group">
                <label>Display Name *</label>
                <input
                  type="text"
                  name="displayName"
                  placeholder="Your public seller name"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  placeholder="Tell buyers about yourself and what you sell..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  placeholder="@username"
                  value={formData.instagram}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="text"
                  name="facebook"
                  placeholder="facebook.com/yourpage"
                  value={formData.facebook}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="text"
                  name="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Verification"}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}