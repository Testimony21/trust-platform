import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, CheckCircle2, Clock, ShieldCheck, AlertTriangle, Upload } from "lucide-react";
import axios from "axios";
import "./GetVerified.css";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB - matches backend limit
const MIN_FILE_SIZE = 1024; // 1KB - rejects empty/corrupted files

export default function GetVerified() {
  const { token, user, loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const status = user?.verificationStatus || "Not Submitted";

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    idType: "National ID",
    phoneNumber: ""
  });
  const [idFile, setIdFile] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateFile = (file) => {
    if (!file) return "Please choose a document to upload.";

    if (file.size === 0) {
      return "That file appears to be empty. Please choose a valid document.";
    }

    if (file.size < MIN_FILE_SIZE) {
      return "That file is too small to be a valid document. Please check the file and try again.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File is too large. Please upload a document under 10MB.";
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return "Unsupported file type. Please upload a JPG, PNG, WEBP, or PDF.";
    }

    return "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setIdFile(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      setIdFile(null);
      e.target.value = ""; // reset the input so the same bad file can be re-selected after a fix
      return;
    }

    setFileError("");
    setIdFile(file);
  };

  const validatePhoneNumber = (phone) => {
    const digitsOnly = phone.replace(/[\s\-+]/g, "");
    return /^\d{7,15}$/.test(digitsOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = formData.fullName.trim();
    const trimmedPhone = formData.phoneNumber.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError("Please enter your full legal name.");
      return;
    }

    if (!trimmedPhone || !validatePhoneNumber(trimmedPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    // File is always required, including on resubmission after rejection -
    // this matches what the backend enforces.
    if (!idFile) {
      setError("Please upload your identity document.");
      return;
    }

    const validationError = validateFile(idFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("fullName", trimmedName);
      payload.append("idType", formData.idType);
      payload.append("phoneNumber", trimmedPhone);
      payload.append("idFile", idFile);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/verification/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (refreshUser) {
        await refreshUser();
      }

      setSuccess(true);
      setFormData({ fullName: "", idType: "National ID", phoneNumber: "" });
      setIdFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Verification submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="verify-page">
        <div className="verify-gate">
          <h2>Sign in to get verified</h2>
          <p>You need an account to apply for verification.</p>
          <div className="verify-gate-actions">
            <Link to="/register" className="primary">Create account</Link>
            <Link to="/login" className="secondary">Log in</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-page">
      <div className="verify-container">

        <div className="verify-info">
          <Link to="/dashboard" className="verify-back">
            <ChevronLeft size={16} /> Back to dashboard
          </Link>

          <span className="verify-badge">TRUST PLATFORM</span>

          <h1>Become a Verified Seller</h1>

          <p>
            Increase buyer confidence, improve your trust score, and stand out from unverified accounts.
          </p>

          <div className="benefits">
            <div className="benefit">
              <h3>✓ Verified Badge</h3>
              <p>Show buyers that your identity has been thoroughly reviewed.</p>
            </div>
            <div className="benefit">
              <h3>✓ Higher Trust Score</h3>
              <p>Build instant platform credibility and improve offer visibility.</p>
            </div>
            <div className="benefit">
              <h3>✓ Buyer Confidence</h3>
              <p>Help buyers feel completely safe before dispatching payments.</p>
            </div>
          </div>

          <div className="status-card">
            <span>Verification Status</span>
            <h3 className={`status-display ${
              status === "Pending Review" ? "status-pending" :
              status === "Approved" ? "status-approved" :
              status === "Rejected" ? "status-rejected" : ""
            }`}>
              {status}
            </h3>

            {status === "Rejected" && user?.verificationAdminNotes && (
              <div className="rejection-reason-box">
                <AlertTriangle size={14} />
                <div>
                  <strong>Reason from Compliance Audit:</strong>
                  <p>"{user.verificationAdminNotes}"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="verify-form-card">
          <h2>Verification Details</h2>
          <p className="form-sub">
            Fill in your authentic identification details below. Our security team will review your application parameters.
          </p>

          {success ? (
            <div className="verify-success">
              <CheckCircle2 size={40} />
              <h3>Submitted Successfully</h3>
              <p>
                Your verification request has been queued. The page context will update as soon as the team finishes the audit.
              </p>
              <button onClick={() => { setSuccess(false); navigate("/dashboard"); }} className="verify-dashboard-btn">
                Go to Dashboard
              </button>
            </div>
          ) : status === "Pending Review" ? (
            <div className="verify-processing-state">
              <Clock size={40} className="status-pending" />
              <h3>Application Under Review</h3>
              <p>
                Your documents are undergoing audit checks. Modifications are disabled until the current assessment cycle completes.
              </p>
              <button onClick={() => navigate("/dashboard")} className="verify-dashboard-btn secondary-btn">
                Return to Dashboard
              </button>
            </div>
          ) : status === "Approved" ? (
            <div className="verify-processing-state">
              <ShieldCheck size={40} className="status-approved" />
              <h3>Verification Approved</h3>
              <p>Your identity details are fully authorized. You hold active seller permissions on the platform.</p>
              <button onClick={() => navigate("/dashboard")} className="verify-dashboard-btn">
                View Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {error && <div className="verify-form-error">{error}</div>}

              {status === "Rejected" && (
                <div className="resubmission-notice">
                  <strong>Action Required:</strong> Please adjust the components flagged by the administrator notes on the left column interface, and upload a new document, before submitting again.
                </div>
              )}

              <div className="form-group">
                <label>Full Legal Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="As it appears on your identity document"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  minLength={2}
                />
              </div>

              <div className="form-group">
                <label>Identity Document Type *</label>
                <select name="idType" value={formData.idType} onChange={handleInputChange}>
                  <option value="National ID">National Identity Card</option>
                  <option value="Drivers License">Driver's License</option>
                  <option value="Passport">International Passport</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+234 800 000 0000"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload ID Document (JPG, PNG, WEBP, or PDF - max 10MB) *</label>
                <div className="file-upload-zone">
                  <input
                    type="file"
                    id="idFile"
                    accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    required
                  />
                  <label htmlFor="idFile" className="file-upload-label">
                    <Upload size={20} />
                    <span>{idFile ? idFile.name : "Choose File or Drag & Drop"}</span>
                  </label>
                </div>
                {fileError && <p className="file-error">{fileError}</p>}
              </div>

              <button type="submit" className="submit-verify-btn" disabled={submitting}>
                {submitting ? "Processing Application..." : status === "Rejected" ? "Resubmit Application" : "Submit Credentials"}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}