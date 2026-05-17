import "./SellerDashboard.css";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();

  // 🧠 IMPORTANT: prevent blank screen
  if (loading) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Loading dashboard...
      </div>
    );
  }

  // if (user.role === "buyer") {
  //   return <BuyerDashboard />;
  // }

  // if (user.role === "seller") {
  //   return <SellerDashboard />;
  // }

  // 🧠 If no user, don't render broken UI
  if (!user) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Not authenticated
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2 className="logo">Trust Platform</h2>

        <nav>
          <p className="active">Overview</p>
          <p>Profile</p>
          <p>Verification</p>
          <p>Trust Score</p>
          <p>Settings</p>
        </nav>

        <button
          className="logout"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        {/* TOP BAR */}
        <div className="topbar">
          <h1>Dashboard</h1>

          <div className="user">
            <div className="avatar">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="name">{user.username}</p>
              <span className="role">{user.role}</span>
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div className="cards">

          <div className="card">
            <h3>Trust Score</h3>
            <p className="big">72%</p>
            <span>Based on verification data</span>
          </div>

          <div className="card">
            <h3>Status</h3>
            <p className="big">Active</p>
            <span>Account is verified</span>
          </div>

          <div className="card">
            <h3>Role</h3>
            <p className="big">{user.role}</p>
            <span>User type on platform</span>
          </div>

        </div>

        {/* ACTIVITY SECTION */}
        <div className="section">

          <h2>Recent Activity</h2>

          <div className="activity">

            <div className="item">
              ✔ Account created successfully
            </div>

            <div className="item">
              ✔ Email verified
            </div>

            <div className="item warning">
              ⚠ ID verification pending
            </div>

          </div>

        </div>

        {/* ACTIONS */}
        <div className="section">

          <h2>Quick Actions</h2>

          <div className="actions">

            <button>Update Profile</button>
            <button>Improve Trust Score</button>
            <button>Verify Identity</button>

          </div>

        </div>

      </main>

    </div>
  );
}