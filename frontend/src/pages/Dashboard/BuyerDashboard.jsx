import "./BuyerDashboard.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function BuyerDashboard() {
  const { user, token, logout } = useAuth();

  // ================= STATE =================
  const [stats, setStats] = useState({
    checksMade: 0,
    savedSellers: 0,
    reportsMade: 0,
    recentActivity: []
  });

  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH DASHBOARD =================
  useEffect(() => {
    fetchBuyerDashboard();
  }, []);

  const fetchBuyerDashboard = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/buyer/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setStats(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY SELLER =================
  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      setError("");
      setResult(null);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/buyer/verify`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResult(res.data.seller);

      // refresh stats
      fetchBuyerDashboard();

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSearchLoading(false);
    }
  };

  // ================= SAVE SELLER =================
  const handleSave = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/buyer/save`,
        { sellerId: result._id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchBuyerDashboard();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= REPORT SELLER =================
  const handleReport = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/buyer/report`,
        { sellerId: result._id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchBuyerDashboard();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return <h2 className="loading">Loading Dashboard...</h2>;
  }

  // ================= UI =================
  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Trust Platform</h2>

        <nav>
          <p className="active">Overview</p>
          <p>Verify Seller</p>
          <p>Saved Sellers</p>
          <p>Reports</p>
          <p>Settings</p>
        </nav>

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <h1>Buyer Dashboard</h1>

          <div className="user">
            <div className="avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="name">{user?.username}</p>
              <span className="role">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="cards">

          <div className="card">
            <h3>Checks Made</h3>
            <p className="big">{stats.checksMade}</p>
            <span>Sellers verified by you</span>
          </div>

          <div className="card">
            <h3>Saved Sellers</h3>
            <p className="big">{stats.savedSellers}</p>
            <span>Trusted sellers bookmarked</span>
          </div>

          <div className="card">
            <h3>Reports Made</h3>
            <p className="big">{stats.reportsMade}</p>
            <span>Suspicious sellers reported</span>
          </div>

        </div>

        {/* SEARCH */}
        <div className="section">
          <h2>Verify a Seller</h2>

          <div className="search-box">
            <input
              type="text"
              placeholder="Enter seller username, phone or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button onClick={handleSearch}>
              {searchLoading ? "Checking..." : "Check Trust"}
            </button>
          </div>

          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {error}
            </p>
          )}
        </div>

        {/* RESULT */}
        {result && (
          <div className="section">
            <h2>Verification Result</h2>

            <div className="card">
              <h3>{result.username || "Unknown Seller"}</h3>

              <p className="big">{result.trustScore}%</p>

              <p>
                {result.isVerified
                  ? "✅ Verified"
                  : "⚠ Not Verified"}
              </p>

              <p>Reports: {result.reports}</p>
              <p>Email: {result.email}</p>
              <p>Phone: {result.phone}</p>

              <div className="actions" style={{ marginTop: "12px" }}>
                <button onClick={handleSave}>
                  Save Seller
                </button>

                <button onClick={handleReport}>
                  Report Seller
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY */}
        <div className="section">
          <h2>Recent Activity</h2>

          <div className="activity">
            {stats.recentActivity.length === 0 ? (
              <div className="item">No activity yet</div>
            ) : (
              stats.recentActivity.map((item, index) => (
                <div className="item" key={index}>
                  {item}
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}