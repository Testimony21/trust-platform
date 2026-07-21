import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, Sparkles, ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import "./login.css";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper utility to pivot dashboard targets based on account status parameters
  const routeUserByRole = (authPayload) => {
    // FIXED: Adjusted to extract the nested user object parameter from your context API payload wrapper
    if (authPayload?.user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const authData = await login(email, password);
      routeUserByRole(authData);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");

      const authData = await loginWithGoogle(credentialResponse.credential);
      routeUserByRole(authData);
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <Link to="/" className="back-home">
        <ChevronLeft size={16} /> Back to home
      </Link>

      {/* LEFT */}
      <div className="login-left">
        <div className="login-left-inner">
          <p className="login-left-title">Why Trust-Platform?</p>

          <div className="login-feature">
            <div className="login-feature-icon">✦</div>
            <div>
              <strong>Instant seller verification</strong>
              <p>Check identity, trust scores, and scam reports in seconds.</p>
            </div>
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">🛡</div>
            <div>
              <strong>Scam protection</strong>
              <p>We flag risky sellers before you send a single naira.</p>
            </div>
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">📋</div>
            <div>
              <strong>Full transaction history</strong>
              <p>Review all your past checks from your dashboard.</p>
            </div>
          </div>

          <div className="login-trust-note">
            🔒 Your data is encrypted and never sold.
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <div className="login-card">

          <div className="login-badge">
            <Sparkles size={14} /> Secure sign in
          </div>

          <h2>Welcome back</h2>
          <p className="login-sub">Login to continue verifying sellers with confidence.</p>

          {error && <div className="login-error">{error}</div>}

          <div className="google-auth">
            <div className="google-signin-btn-container">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Google login failed")}
                theme="filled_black"
                size="large"
                text="signin_with"
                width="100%"
              />
            </div>
          </div>
          
          <div className="auth-divider">
            <span></span>
            <p>or continue with email</p>
            <span></span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            <div className="login-field-wrap">
              <label>Email address</label>
              <div className="login-field">
                <Mail size={17} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field-wrap">
              <div className="login-label-row">
                <label>Password</label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <div className="login-field">
                <LockKeyhole size={17} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
              <ArrowRight size={18} />
            </button>

          </form>

          <p className="login-signup">
            New to Trust Platform? <Link to="/register">Create account</Link>
          </p>

        </div>
      </div>

    </div>
  );
}