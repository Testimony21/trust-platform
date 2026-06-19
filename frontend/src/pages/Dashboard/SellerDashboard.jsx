import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/images/bg-logo.png";
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
  Search,
} from "lucide-react";
import "./SellerDashboard.css";

export default function SellerDashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="dash-loading">Loading dashboard...</div>;
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
              <BadgeCheck size={18} /> Verification
            </Link>
            <Link to="/dashboard/trust-score" className="dash-nav-item">
              <Star size={18} /> Trust Score
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

      {/* MAIN */}
      <main className="dash-main">

        {/* TOPBAR */}
        <div className="dash-topbar">
          <div>
            <h1>Overview</h1>
            <p className="dash-date">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long", day: "numeric",
                month: "long", year: "numeric"
              })}
            </p>
          </div>

          <div className="dash-user">
            <div className="dash-avatar">{initials}</div>
            <div>
              <p className="dash-name">{user.fullName || "Seller"}</p>
              <span className="dash-role">Seller account</span>
            </div>
          </div>
        </div>

        {/* ALERT — new account */}
        <div className="dash-alert">
          <AlertTriangle size={17} />
          <span>Your trust score starts at 0. Complete your profile and get buyer reviews to grow it.</span>
        </div>

        {/* STAT CARDS */}
        <div className="dash-cards">
          <div className="dash-card">
            <div className="dash-card-top">
              <span className="dash-card-label">Trust Score</span>
              <div className="dash-card-icon purple">
                <Star size={18} />
              </div>
            </div>
            <p className="dash-card-value">0%</p>
            <span className="dash-card-sub">No reviews yet</span>
            <div className="dash-score-bar">
              <div className="dash-score-fill" style={{ width: "0%" }} />
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-top">
              <span className="dash-card-label">Verification</span>
              <div className="dash-card-icon orange">
                <BadgeCheck size={18} />
              </div>
            </div>
            <p className="dash-card-value">Pending</p>
            <span className="dash-card-sub">Identity not verified yet</span>
          </div>

          <div className="dash-card">
            <div className="dash-card-top">
              <span className="dash-card-label">Total Deals</span>
              <div className="dash-card-icon green">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <p className="dash-card-value">0</p>
            <span className="dash-card-sub">No completed deals yet</span>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="dash-bottom">

          {/* ACTIVITY */}
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

          {/* NEXT STEPS */}
          <div className="dash-section">
            <h2>Get started</h2>
            <div className="dash-steps">
              <div className="dash-step">
                <div className="dash-step-num">1</div>
                <div>
                  <strong>Complete your profile</strong>
                  <p>Add your bio, photo, and social links.</p>
                  <Link to="/dashboard/profile" className="dash-step-link">
                    Go to Profile →
                  </Link>
                </div>
              </div>
              <div className="dash-step">
                <div className="dash-step-num">2</div>
                <div>
                  <strong>Verify your identity</strong>
                  <p>Submit ID to unlock full seller features.</p>
                  <Link to="/dashboard/verification" className="dash-step-link">
                    Start Verification →
                  </Link>
                </div>
              </div>
              <div className="dash-step">
                <div className="dash-step-num">3</div>
                <div>
                  <strong>Get your first review</strong>
                  <p>Share your profile link with buyers to start building trust.</p>
                  <Link to="/dashboard/trust-score" className="dash-step-link">
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}