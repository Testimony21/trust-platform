import { Link } from "react-router-dom";
import logo from "../../assets/images/bg-logo.png";  
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo" aria-label="Trust Platform home">
        <img src={logo} alt="Trust-Platform Logo" />
      </Link>

      <nav>
        {/* <a href="#how">How it works</a>
        <a href="#why">Why trust</a> */}
        <Link to="/login" className="btn ghost">Login</Link>
        <Link to="/verify-seller" className="btn solid">Verify a Seller</Link>
      </nav>
    </header>
  );
}
