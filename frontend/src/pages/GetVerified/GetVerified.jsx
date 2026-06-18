import { useState } from "react";
import "./GetVerified.css";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";


export default function GetVerified() {
    const { token } = useAuth();

    const [status, setStatus] = useState("Not Submitted");

    const [formData, setFormData] = useState({
        displayName: "",
        phone: "",
        bio: "",
        instagram: "",
        facebook: "",
        website: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.displayName.trim()) {
            alert("Display name is required");
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/seller/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStatus("Pending Review");

            setFormData({
                displayName: "",
                phone: "",
                bio: "",
                instagram: "",
                facebook: "",
                website: ""
            });

            alert("Verification submitted successfully");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="verify-page">

            <div className="verify-container">

                {/* LEFT */}
                <div className="verify-info">

                    <span className="verify-badge">
                        TRUST PLATFORM
                    </span>

                    <h1>
                        Become a Verified Seller
                    </h1>

                    <p>
                        Increase buyer confidence, improve your
                        trust score, and stand out from unverified
                        sellers.
                    </p>

                    <div className="benefits">

                        <div className="benefit">
                            <h3>✓ Verified Badge</h3>
                            <p>
                                Show buyers that your identity has
                                been reviewed.
                            </p>
                        </div>

                        <div className="benefit">
                            <h3>✓ Higher Trust Score</h3>
                            <p>
                                Build credibility and improve visibility.
                            </p>
                        </div>

                        <div className="benefit">
                            <h3>✓ Buyer Confidence</h3>
                            <p>
                                Help buyers feel safer before payment.
                            </p>
                        </div>

                    </div>

                    <div className="status-card">
                        <span>Status</span>
                        <h3>{status}</h3>
                    </div>

                </div>

                {/* RIGHT */}
                <div className="verify-form-card">

                    <h2>Verification Details</h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="displayName"
                            placeholder="Display Name"
                            value={formData.displayName}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                        <textarea
                            name="bio"
                            placeholder="Tell buyers about yourself..."
                            value={formData.bio}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="instagram"
                            placeholder="Instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="facebook"
                            placeholder="Facebook"
                            value={formData.facebook}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="website"
                            placeholder="Website"
                            value={formData.website}
                            onChange={handleChange}
                        />

                        <button type="submit">
                            Submit Verification
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}