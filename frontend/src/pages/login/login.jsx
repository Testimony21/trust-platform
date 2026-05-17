import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  FaGoogle,
  FaApple
} from "react-icons/fa";

import "./login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(email, password);

      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <span className="login-badge">
          TrustPlatform
        </span>

        <h1>
          Welcome back
        </h1>

        <p className="login-text">
          Login to continue verifying sellers.
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* SOCIALS */}
        <div className="social-row">

          <button className="social-btn">
            <FaGoogle />
          </button>

          <button className="social-btn">
            <FaApple />
          </button>

        </div>

        <div className="divider">
          <span>or</span>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <div className="bottom-links">

          <Link to="/">
            Forgot password?
          </Link>

          <span>•</span>

          <Link to="/register">
            Create account
          </Link>

        </div>

      </div>

    </div>
  );
}