import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/new-logo.png";  
import "./Navbar.css";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="logo" aria-label="Trust Platform home">
        <img src={logo} alt="Trust-Platform Logo" />
      </Link>

      <nav>
        {user ? (
          <>
            <Link to="/dashboard" className="btn ghost">Dashboard</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="btn ghost">Login</Link>
          </>
        )}
        <Link to="/verify-seller" className="btn solid">Verify a Seller</Link>

        <Link to="/deals" className="btn ghost">Transactions</Link>
      </nav>
    </header>
  );
}
