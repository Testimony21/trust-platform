import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "buyer"
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await axios.post("http://localhost:5000/api/auth/register", form);

            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const [loading, setLoading] = useState(false);

    return (
        <div>
            <h2>Sign Up</h2>

            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </select>

                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}