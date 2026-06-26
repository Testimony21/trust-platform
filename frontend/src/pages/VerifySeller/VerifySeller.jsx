import { Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Lock,
  Search,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import "./VerifySeller.css";

export default function VerifySeller() {
  const [searchParams] = useSearchParams();
  const prefill = searchParams.get("q") || "";
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState(prefill);
  const [platform, setPlatform] = useState("");
  const [notes, setNotes] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect logged-in buyers to their dashboard search instead
  useEffect(() => {
    if (!authLoading && user?.role === "buyer") {
      navigate("/dashboard", { state: { prefillQuery: prefill } });
    }
  }, [user, authLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResults([]);

    if (!query.trim()) {
      setError("Please enter a phone number, email, or name.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/seller/search`,
        { query }
      );
      setResults(res.data.results);
    } catch (err) {
      setError(err.response?.data?.message || "No seller found matching that information.");
    } finally {
      setLoading(false);
    }
  };

  // Don't flash the public page while we check auth/redirect
  if (authLoading || user?.role === "buyer") {
    return null;
  }

  return (
    <main className="verify-page">

      <section className="verify-shell">
        <Link to="/" className="verify-back">
          <ChevronLeft size={20} />
          Back to home
        </Link>

        <div className="verify-intro">
          <span className="verify-kicker">Seller Trust Check</span>
          <h1>Verify a Seller</h1>
          <p>
            Search with a phone number, email, or name to review trust
            signals before making payment.
          </p>
        </div>

        <div className="verify-layout">
          <form className="verify-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <h2>Seller details</h2>
              <p>Start with the detail you have. You can add more if needed.</p>
            </div>

            <div className="verify-field">
              <label htmlFor="sellerIdentity">Phone, email, or name</label>
              <div className="verify-input">
                <Search size={19} />
                <input
                  id="sellerIdentity"
                  type="text"
                  placeholder="e.g. 0803 123 4567 or John Doe"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="verify-field">
              <label htmlFor="platform">Where did you find them?</label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="" disabled>Select platform</option>
                <option>Instagram</option>
                <option>Facebook Marketplace</option>
                <option>WhatsApp</option>
                <option>TikTok</option>
                <option>Website</option>
                <option>Other</option>
              </select>
            </div>

            <div className="verify-field">
              <label htmlFor="notes">Extra details (optional)</label>
              <textarea
                id="notes"
                rows="4"
                placeholder="Add anything that may help the check..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="verify-submit" disabled={loading}>
              <span>{loading ? "Checking..." : "Check Seller"}</span>
              <ArrowRight size={20} />
            </button>

            {error && <p className="verify-error">{error}</p>}

            <p className="verify-note">
              <Lock size={15} />
              We only use this information to run the seller check.
            </p>
          </form>

          {results.length > 0 ? (
            <div className="verify-results">
              {results.map((seller) => (
                <div key={seller._id} className="verify-result-card">
                  <div className="verify-result-top">
                    <h3>{seller.displayName}</h3>
                    <span className={seller.isVerified ? "tag-verified" : "tag-unverified"}>
                      {seller.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <div className="verify-result-score">{seller.trustScore}%</div>
                  <p>Email: {seller.email}</p>
                  <p>Phone: {seller.phone}</p>
                  <p>Successful Deals: {seller.successfulDeals} / {seller.totalDeals}</p>
                </div>
              ))}

              {/* SIGNUP CTA — only shown to logged-out users after a search */}
              {!user && (
                <div className="verify-signup-cta">
                <ShieldCheck size={20} />
                <div>
                  <strong>Want to track this seller?</strong>
                  <p>Create a free account to save searches, bookmark sellers, and file reports.</p>
                </div>
                <Link to="/register" className="verify-cta-btn">
                  Create account
                </Link>
              </div>
              )}
              </div>
          ) : (
            <aside className="verify-side-card">
              <div className="side-icon">
                <ShieldCheck size={30} />
              </div>
              <h2>What happens next?</h2>
              <div className="side-list">
                <div>
                  <CheckCircle2 size={20} />
                  <span>We look for identity and contact signals.</span>
                </div>
                <div>
                  <CheckCircle2 size={20} />
                  <span>We check for scam reports or suspicious patterns.</span>
                </div>
                <div>
                  <CheckCircle2 size={20} />
                  <span>You get a simple trust summary before paying.</span>
                </div>
              </div>
              <div className="sample-result">
                <FileText size={22} />
                <div>
                  <strong>Sample result</strong>
                  <p>Trust score, risk notes, and a suggested next step.</p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}