import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/images/bg-logo.png";
import DashboardLoader from "../../components/DashboardLoader/DashboardLoader";
import {
  ShieldCheck,
  Star,
  BadgeCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  User,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import NotificationBell from "../../components/NotificationBell/NotificationBell";
import "./SellerDashboard.css";

export default function SellerDashboard() {
  // Pull fields and sync utilities from Auth Context
  const { user, logout, loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Automatically fetch fresh user context data when dashboard mounts
  useEffect(() => {
    if (user) {
      refreshUser();
    }
  }, [refreshUser]);

  // Helper definition using safe navigation operators
  const getVerificationDisplay = () => {
    switch (user?.verificationStatus) {
      case "Approved":
        return { label: "Verified", color: "var(--success)", icon: <ShieldCheck size={16} /> };
      case "Pending Review":
        return { label: "In Review", color: "#f59e0b", icon: <Clock size={16} /> };
      case "Rejected":
        return { label: "Verification Rejected", color: "var(--danger)", icon: <AlertTriangle size={16} /> };
      default:
        return { label: "Not Verified", color: "#64748b", icon: <BadgeCheck size={16} /> };
    }
  };

  // Invoke helper layout configuration once loading states settle
  const verificationDisplay = getVerificationDisplay();

  if (authLoading) {
    return <DashboardLoader />;
  }

  if (!user) {
    return <div className="dash-loading">Not authenticated</div>;
  }

  const initials = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const checklistItems = [
    {
      done: !!user.fullName && !!user.phone,
      label: "Complete your profile",
      link: "/dashboard/profile",
      linkText: "Complete Profile →",
    },
    {
      done: user.verificationStatus === "Approved",
      label: "Get verified",
      link: "/dashboard/verification", // Fixed path from /GetVerified to match routing architecture
      linkText: user.verificationStatus === "Pending Review" 
        ? "In review..." 
        : user.verificationStatus === "Rejected"
        ? "Resubmit application →"
        : "Start Verification →",
    },
    {
      done: false,
      label: "Complete your first transaction",
      link: "/dashboard/transactions",
      linkText: "View Transactions →",
    },
  ];

  const allDone = checklistItems.every((item) => item.done);
  const doneCount = checklistItems.filter((i) => i.done).length;

  return (
    <div className="dash">

      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div>
          <Link to="/" className="dash-logo" aria-label="Trust Platform home">
            <img src={logo} alt="Trust-Platform Logo" />
          </Link>

          <nav className="dash-nav">
            <Link to="/dashboard" className="dash-nav-item active">
              <LayoutDashboard size={18} /> Overview
            </Link>
            <Link to="/dashboard/profile" className="dash-nav-item">
              <User size={18} /> Profile
            </Link>
            <Link to="/dashboard/verification" className="dash-nav-item">
              <BadgeCheck size={18} /> Verification Status
            </Link>
            <Link to="/dashboard/transactions" className="dash-nav-item">
              <ShieldCheck size={18} /> Transactions
            </Link>
            <Link to="/dashboard/reviews" className="dash-nav-item">
              <Star size={18} /> Reviews
            </Link>
            <Link to="/dashboard/settings" className="dash-nav-item">
              <Settings size={18} /> Settings
            </Link>
          </nav>
        </div>

        <button className="dash-logout" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dash-main">

        {/* TOPBAR */}
        <div className="dash-topbar">
          <div>
            <h1>Overview</h1>
            <div className="dash-date">
              {user.verificationStatus === "Pending Review" && (
                <div className="status-banner banner-pending">
                  <Clock size={18} />
                  <div>
                    <strong>Application Under Review</strong>
                    <p>Our compliance team is verifying your details. You will be notified once complete.</p>
                  </div>
                </div>
              )}

              {user.verificationStatus === "Approved" && (
                <div className="status-banner banner-approved">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>Account Fully Verified</strong>
                    <p>Your Trust Badge is now active on payment checkouts and lookups!</p>
                  </div>
                </div>
              )}

              {user.verificationStatus === "Rejected" && (
                <div className="status-banner banner-rejected">
                  <AlertTriangle size={18} />
                  <div>
                    <strong>Verification Request Refused</strong>
                    <p>Reason: {user.verificationAdminNotes || "Documentation did not meet verification criteria."}</p>
                    <Link to="/dashboard/verification" className="banner-action-btn">Re-submit Application</Link>
                  </div>
                </div>
              )}
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long", day: "numeric",
                month: "long", year: "numeric"
              })}
            </div>
          </div>

          <div className="dash-user">
            <NotificationBell />
            <div className="dash-avatar">{initials}</div>
            <div>
              <p className="dash-name">{user.fullName || "Seller"}</p>
              <span className="dash-role">Seller account</span>
            </div>
          </div>
        </div>

        {/* INFO ALERT */}
        <div className="dash-alert">
          <AlertTriangle size={17} />
          <span>
            Your trust score is earned through successful transactions and buyer reviews.
            Complete your profile so buyers know who they're dealing with.
          </span>
        </div>

        {/* STAT METRICS CARD */}
        <div className="dash-card">
          <div className="dash-card-top">
            <span className="dash-card-label">Verification</span>
            <div className="dash-card-icon orange">
              <BadgeCheck size={18} />
            </div>
          </div>
          <div className="dash-card-value" style={{
            fontSize: "1.2rem",
            color: verificationDisplay.color,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            {verificationDisplay.icon}
            {verificationDisplay.label}
          </div>
          <span className="dash-card-sub">
            {user.verificationStatus === "Not Submitted" && (
              <Link to="/dashboard/verification" style={{ color: "var(--primary-light)" }}>
                Start verification →
              </Link>
            )}
            {user.verificationStatus === "Pending Review" && "Under admin review"}
            {user.verificationStatus === "Approved" && "Identity confirmed"}
            {user.verificationStatus === "Rejected" && (
              <Link to="/dashboard/verification" style={{ color: "var(--danger)" }}>
                Resubmit application →
              </Link>
            )}
          </span>
        </div>

        {/* BOTTOM CONTENT GRID */}
        <div className="dash-bottom">

          {/* HISTORICAL ACTIVITY FEED */}
          <div className="dash-section">
            <h2>Account activity</h2>
            <div className="dash-activity">
              <div className="dash-activity-item">
                <CheckCircle2 size={16} className="icon-green" />
                <span>Account created successfully</span>
                <span className="dash-activity-time">Just now</span>
              </div>
              <div className="dash-activity-item">
                <Clock size={16} className="icon-orange" />
                <span>Profile setup incomplete</span>
                <span className="dash-activity-time">Pending</span>
              </div>
              <div className="dash-activity-item">
                <Clock size={16} className="icon-orange" />
                <span>Identity verification pending</span>
                <span className="dash-activity-time">Pending</span>
              </div>
            </div>
          </div>

          {/* PROGRESS CHECKLIST ACTIONABLE INTERFACE */}
          {!allDone && (
            <div className="dash-section">
              <div className="checklist-header">
                <h2>Get started</h2>
                <span>{doneCount}/{checklistItems.length} done</span>
              </div>
              <div className="checklist-progress">
                <div
                  className="checklist-bar"
                  style={{ width: `${(doneCount / checklistItems.length) * 100}%` }}
                />
              </div>
              <div className="checklist-items" style={{ marginTop: "16px" }}>
                {checklistItems.map((item, i) => (
                  <div key={i} className={`checklist-item ${item.done ? "done" : ""}`}>
                    <div className="checklist-tick">
                      {item.done ? "✓" : i + 1}
                    </div>
                    <div>
                      <strong>{item.label}</strong>
                      {!item.done && (
                        <Link to={item.link} className="dash-step-link">
                          {item.linkText}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}