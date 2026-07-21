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
import "./SellerDashboard.css";

export default function SellerDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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
    done: false,
    label: "Complete your first transaction",
    link: "/dashboard/transactions",
    linkText: "View Transactions →",
  },
  {
    done: false,
    label: "Receive your first buyer review",
    link: "/dashboard/reviews",
    linkText: "Learn More →",
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

        {/* ALERT */}
        <div className="dash-alert">
          <AlertTriangle size={17} />

          <span>
            Your trust score is earned through successful transactions and buyer reviews.
            Complete your profile so buyers know who they're dealing with.
          </span>
        </div>

        {/* STAT CARDS */}
        <div className="dash-cards">
          <div className="dash-card">
            <div className="dash-card-top">
              <span className="dash-card-label">Buyer Rating</span>

              <div className="dash-card-icon orange">
                <Star size={18} />
              </div>
            </div>

            <p className="dash-card-value">--</p>

            <span className="dash-card-sub">
              No buyer reviews yet
            </span>
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

          {/* ONBOARDING CHECKLIST */}
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