import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ShieldCheck, Lock, Trash2 } from "lucide-react";
import { getDeals, deleteDeal } from "../../api/dealApi";
import { useAuth } from "../../context/AuthContext";
import "./Deals.css";
import logo from "../../assets/images/bg-logo.png";

export default function Deals() {
  const { user, loading: authLoading } = useAuth();

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSeller = user?.role === "seller";

  useEffect(() => {
    if (!user) return;

    const loadDeals = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getDeals();
        setDeals(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, [user]);

  const handleDelete = async (dealId) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteDeal(dealId);
      setDeals((prev) => prev.filter((d) => d._id !== dealId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="gate-screen">
        <div className="gate-nav">
          <Link to="/" aria-label="Trust Platform home">
            <img src={logo} alt="Trust-Platform Logo" />
          </Link>
        </div>
        <div className="gate-card">
          <div className="gate-icon">
            <Lock size={28} />
          </div>
          <h2>Sign in to continue</h2>
          <p>
            Create an account or log in to verify sellers, access transactions,
            and trade safely on Trust-Platform.
          </p>
          <div className="gate-actions">
            <Link to="/register" className="primary">Create account</Link>
            <Link to="/login" className="secondary">Log in</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="deals-page">
      <section className="deals-shell">
        <div className="deals-header">
          <div>
            <p className="deals-kicker">
              {isSeller ? "Buyer Requests" : "Transactions"}
            </p>
            <h1>
              {isSeller ? "Requests from buyers" : "Your transactions"}
            </h1>
            <p>
              {isSeller
                ? "See buyer requests, chat with buyers, and update each transaction."
                : "Check a seller, start a transaction, chat safely, and leave a review when it is done."}
            </p>
          </div>
        </div>

        {loading && <div className="deals-state">Loading transactions...</div>}
        {error && <div className="deals-error">{error}</div>}

        {!loading && !error && deals.length === 0 && (
          <div className="deals-empty">
            <ShieldCheck size={34} />
            <h2>{isSeller ? "No requests yet" : "No transactions yet"}</h2>
            <p>
              {isSeller
                ? "When a buyer starts a transaction with you, it will show here."
                : "Check a seller first. Then you can start a transaction and chat with the seller."}
            </p>
            {!isSeller && <Link to="/verify-seller">Check a seller</Link>}
          </div>
        )}

        {!loading && deals.length > 0 && (
          <div className="deals-grid">
            {deals.map((deal) => (
              <article className="deal-card" key={deal._id}>
                <div className="deal-card-top">
                  <span className={`deal-status status-${deal.status}`}>
                    {deal.status.replace("_", " ")}
                  </span>
                  <MessageCircle size={18} />
                </div>

                <h2>{deal.title}</h2>

                <div className="deal-meta">
                  <p>
                    <span>Buyer</span>
                    {deal.buyer?.fullName || deal.buyer?.email || "Buyer"}
                  </p>
                  <p>
                    <span>Seller</span>
                    {deal.seller?.fullName || deal.seller?.email || "Seller"}
                  </p>
                  <p>
                    <span>Amount</span>
                    {deal.amount
                      ? `₦${Number(deal.amount).toLocaleString()}`
                      : "Not set"}
                  </p>
                  <p>
                    <span>Platform</span>
                    {deal.platform || "Not set"}
                  </p>
                </div>

                <div className="deal-card-actions">
                  <Link className="deal-open" to={`/deals/${deal._id}`}>
                    Open transaction
                  </Link>

                  {deal.status === "pending" && (
                    <button
                      className="deal-delete"
                      onClick={() => handleDelete(deal._id)}
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}