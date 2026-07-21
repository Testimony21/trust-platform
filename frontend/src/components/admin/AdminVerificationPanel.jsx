import { useState, useEffect } from "react";
import { ShieldCheck, LogOut, LayoutDashboard, Check, X, ShieldAlert, FileText, ExternalLink, RefreshCw, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate to redirect after logout
import { useAuth } from "../../context/AuthContext"; // Import your auth hook
import logo from "../../assets/images/new-logo.png";
import "./AdminVerification.css";

export default function AdminVerificationPanel() {
  const { logout } = useAuth(); // Grab the logout handler
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all pending requests from the backend
  const fetchPendingQueue = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/verification/pending", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (result.success) {
        setApplications(result.data);
        setSelectedApp(result.data[0] || null);
      }
    } catch (err) {
      console.error("Failed fetching KYC queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingQueue();
  }, []);

  const handleReviewAction = async (finalStatus) => {
    if (finalStatus === "Rejected" && !rejectionReason.trim()) {
      alert("Please specify a reason for declining this document.");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/verification/review/${selectedApp._id}`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          action: finalStatus,
          reason: finalStatus === "Rejected" ? rejectionReason : ""
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setRejectionReason("");
        setShowRejectInput(false);
        await fetchPendingQueue();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error("Error submitting review action:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle logging out safely
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="admin-verif-loading">
        <RefreshCw size={24} className="spin-icon" />
        <p>Loading compliance verification audit queue...</p>
      </div>
    );
  }

  return (
    <div className="admin-verif-container">
      {/* LEFT COLUMN: PENDING USER QUEUE ROW SELECTOR */}
      <div className="admin-verif-sidebar">
        
        {/* Brand Identity Header & Home Link Escape Route */}
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo-wrapper" aria-label="Go back to Home">
            <img src={logo} alt="Trust-Platform Logo" className="admin-mini-logo" />
          </Link>
          <span className="admin-panel-tag">Compliance Hub</span>
        </div>

        <div className="sidebar-header">
          <h3>Verification Queue</h3>
          <span className="queue-badge">{applications.length} Pending</span>
        </div>

        <div className="queue-list">
          {applications.length === 0 ? (
            <div className="empty-queue-state">
              <UserCheck size={32} />
              <p>All clean! No profiles currently awaiting manual verification.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div 
                key={app._id} 
                className={`queue-item ${selectedApp?._id === app._id ? 'selected' : ''}`}
                onClick={() => { setSelectedApp(app); setShowRejectInput(false); }}
              >
                <div className="queue-item-info">
                  <strong>{app.fullName}</strong>
                  <span>{app.userId?.email || "No email bound"}</span>
                </div>
                <span className="doc-tag">{app.idType?.replace('_', ' ')}</span>
              </div>
            ))
          )}
        </div>

        {/* UPDATED: Sidebar Footer with working Navigation & Logout Actions */}
        <div className="admin-sidebar-footer">
          <Link to="/dashboard" className="admin-dashboard-btn">
            <LayoutDashboard size={16} /> Standard Dashboard
          </Link>
          <button onClick={handleLogout} className="admin-logout-btn" aria-label="Log out">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: CORE WORKSPACE & DOCUMENT VIEWER */}
      <div className="admin-verif-workspace">
        {selectedApp ? (
          <div className="workspace-grid">
            <div className="document-preview-pane">
              <div className="pane-header">
                <h4>Uploaded Credential Proof</h4>
                <a href={selectedApp.idDocUrl} target="_blank" rel="noreferrer" className="external-link">
                  Open Original <ExternalLink size={14} />
                </a>
              </div>
              <div className="image-wrapper">
                <img src={selectedApp.idDocUrl} alt="User Document Proof" />
              </div>
            </div>

            <div className="audit-controls-pane">
              <h3>Applicant Parameters</h3>
              
              <div className="metadata-box">
                <div className="meta-row">
                  <label>Legal Name:</label>
                  <span>{selectedApp.fullName}</span>
                </div>
                <div className="meta-row">
                  <label>ID Classification:</label>
                  <span className="capitalize">{selectedApp.idType?.replace('_', ' ')}</span>
                </div>
                <div className="meta-row">
                  <label>Mobile Protocol Link:</label>
                  <span>{selectedApp.phoneNumber}</span>
                </div>
                <div className="meta-row">
                  <label>Submission Date:</label>
                  <span>{selectedApp.submittedAt ? new Date(selectedApp.submittedAt).toLocaleString() : "N/A"}</span>
                </div>
              </div>

              <div className="action-buttons-wrapper">
                {!showRejectInput ? (
                  <>
                    <button 
                      className="btn-approve" 
                      disabled={actionLoading} 
                      onClick={() => handleReviewAction("Approved")}
                    >
                      <Check size={16} /> Approve Credentials
                    </button>
                    <button 
                      className="btn-reject-trigger" 
                      onClick={() => setShowRejectInput(true)}
                    >
                      <X size={16} /> Decline Application
                    </button>
                  </>
                ) : (
                  <div className="rejection-input-flow">
                    <label>Reason for Application Denial</label>
                    <textarea
                      placeholder="e.g. Text is blurry, expired ID, name mismatch..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <div className="rejection-actions">
                      <button 
                        className="btn-reject-confirm"
                        disabled={actionLoading}
                        onClick={() => handleReviewAction("Rejected")}
                      >
                        Confirm Rejection
                      </button>
                      <button className="btn-cancel" onClick={() => setShowRejectInput(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="workspace-blank-state">
            <ShieldAlert size={48} />
            <p>Select an identity check profile item from the queue to run compliance auditing updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}