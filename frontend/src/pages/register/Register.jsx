import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./Register.css";

export default function Register() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "buyer",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, form);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <Link to="/" className="back-home">
                <ChevronLeft size={16} /> Back to home
            </Link>

            {/* LEFT */}
            <div className="register-left">
                <div className="register-left-inner">
                    <div className="reg-steps">
                        <p className="reg-steps-title">How it works</p>
                        <div className="reg-step">
                            <div className="reg-step-num">1</div>
                            <div>
                                <strong>Create your account</strong>
                                <p>Sign up as a buyer or seller in seconds.</p>
                            </div>
                        </div>
                        <div className="reg-step">
                            <div className="reg-step-num">2</div>
                            <div>
                                <strong>Verify your identity</strong>
                                <p>We confirm who you are to build trust.</p>
                            </div>
                        </div>
                        <div className="reg-step">
                            <div className="reg-step-num">3</div>
                            <div>
                                <strong>Trade with confidence</strong>
                                <p>Buy or sell knowing both sides are verified.</p>
                            </div>
                        </div>
                    </div>

                    <div className="reg-trust-note">
                        🔒 Your data is encrypted and never sold.
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="register-right">
                <div className="register-card">

                    <div className="reg-badge">
                        <span>✦</span> Create account
                    </div>

                    <h2>Join Trust-Platform</h2>
                    <p className="reg-sub">Start verifying sellers and trading safely.</p>

                    {error && <div className="reg-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="reg-form">

                        <div className="reg-field">
                            <label>Full name</label>
                            <input
                                name="fullName"
                                placeholder="John Doe"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="reg-field">
                            <label>Email address</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="reg-field">
                            <label>Phone number</label>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="+234 800 000 0000"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="reg-field">
                            <label>Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Min. 8 characters"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="reg-field">
                            <label>I am a</label>
                            <div className="reg-role">
                                <button
                                    type="button"
                                    className={`role-btn ${form.role === "buyer" ? "active" : ""}`}
                                    onClick={() => setForm({ ...form, role: "buyer" })}
                                >
                                    🛒 Buyer
                                </button>
                                <button
                                    type="button"
                                    className={`role-btn ${form.role === "seller" ? "active" : ""}`}
                                    onClick={() => setForm({ ...form, role: "seller" })}
                                >
                                    🏪 Seller
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="reg-submit" disabled={loading}>
                            {loading ? "Creating account..." : "Create Account →"}
                        </button>

                    </form>

                    <p className="reg-login">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>

                </div>
            </div>

        </div>
    );
}