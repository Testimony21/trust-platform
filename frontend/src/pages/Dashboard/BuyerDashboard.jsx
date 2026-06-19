import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/images/bg-logo.png";
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  Bookmark,
  Flag,
  Clock,
  LayoutDashboard,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import "./BuyerDashboard.css";

export default function BuyerDashboard() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    checksMade: 0,
    savedSellers: 0,
    reportsMade: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBuyerDashboard();
  }, []);

  const fetchBuyerDashboard = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/buyer/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setSearchLoading(true);
      setError("");
      setResult(null);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/buyer/verify`,
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(res.data.seller);
      fetchBuyerDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSave = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/buyer/save`,
        { sellerId: result._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBuyerDashboard();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReport = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/buyer/report`,
        { sellerId: result._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBuyerDashboard();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (authLoading || loading) {
    return <div className="dash-loading">Loading dashboard...</div>;
  }

  if (!user) {
    return <div className="dash-loading">Not authenticated</div>;
  }

  const initials = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

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
            <Link to="/dashboard/history" className="dash-nav-item">
              <History size={18} /> Check History
            </Link>
            <Link to="/dashboard/saved" className="dash-nav-item">
              <Bookmark size={18} /> Saved Sellers
            </Link>
            <Link to="/dashboard/reports" className="dash-nav-item">
              <Flag size={18} /> My Reports
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
              <p className="dash-name">{user.fullName || "Buyer"}</p>
              <span className="dash-role">Buyer account</span>
            </div>
          </div>
        </div>

        {/* SEARCH CARD */}
        <div className="buyer-search-card">
          <div className="buyer-search-heading">
            <ShieldCheck size={20} />
            <div>
              <h2>Verify a seller</h2>
              <p>Check trust score, identity, and scam reports before you pay.</p>
            </div>
          </div>

          <div className="buyer-search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Enter seller username, email, or phone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch} disabled={searchLoading}>
              {searchLoading ? "Checking..." : "Check Trust"}
            </button>
          </div>

          {error && <p className="buyer-search-error">{error}</p>}
        </div>

        {/* RESULT */}
        {result && (
          <div className="buyer-result-card">
            <div className="buyer-result-top">
              <div>
                <h3>{result.fullName || result.displayName || "Unknown Seller"}</h3>
                <span className={result.isVerified ? "tag-verified" : "tag-unverified"}>
                  {result.isVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
              <div className="buyer-result-score">
                <span>{result.trustScore ?? 0}%</span>
                <small>Trust Score</small>
              </div>
            </div>

            <div className="buyer-result-details">
              <div><span>Email</span><strong>{result.email || "—"}</strong></div>
              <div><span>Phone</span><strong>{result.phone || "—"}</strong></div>
              <div><span>Reports</span><strong>{result.reports ?? 0}</strong></div>
            </div>

            <div className="buyer-result-actions">
              <button className="btn-outline" onClick={handleSave}>
                <Bookmark size={15} /> Save Seller
              </button>
              <button className="btn-danger" onClick={handleReport}>
                <Flag size={15} /> Report Seller
              </button>
            </div>
          </div>
        )}

        {/* STAT CARDS */}
        <div className="dash-cards">
          <div className="dash-card">
            <div className="dash-card-top">
              <span className="dash-card-label">Checks Made</span>
              <div className="dash-card-icon purple">
                <Search size={18} />
              </div>
            </div>
            <p className="dash-card-value">{stats.checksMade}</p>
            <span className="dash-card-sub">Sellers verified by you</span>
          </div>

          <div className="dash-card">
            <div className="dash-card-top">
              <span className="dash-card-label">Saved Sellers</span>
              <div className="dash-card-icon green">
                <Bookmark size={18} />
              </div>
            </div>
            <p className="dash-card-value">{stats.savedSellers}</p>
            <span className="dash-card-sub">Trusted sellers bookmarked</span>
          </div>

          <div className="dash-card">
            <div className="dash-card-top">
              <span className="dash-card-label">Reports Made</span>
              <div className="dash-card-icon orange">
                <Flag size={18} />
              </div>
            </div>
            <p className="dash-card-value">{stats.reportsMade}</p>
            <span className="dash-card-sub">Suspicious sellers flagged</span>
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="dash-bottom single">
          <div className="dash-section">
            <h2>Recent activity</h2>
            <div className="dash-activity">
              {stats.recentActivity.length === 0 ? (
                <div className="dash-activity-item">
                  <Clock size={16} className="icon-orange" />
                  <span>No activity yet — try verifying a seller above.</span>
                </div>
              ) : (
                stats.recentActivity.map((item, i) => (
                  <div className="dash-activity-item" key={i}>
                    <CheckCircle2 size={16} className="icon-green" />
                    <span>{item}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}