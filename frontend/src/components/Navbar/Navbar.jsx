import { Link } from "react-router-dom";
import logo from "../../assets/images/bg-logo.png";  
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        <img src={logo} alt="Trust-Platform Logo" />
      </div>

      <nav>
        {/* <a href="#how">How it works</a>
        <a href="#why">Why trust</a> */}
        <Link to="/login" className="btn ghost">Login</Link>
        <Link to="/register" className="btn solid">Get Started</Link>
      </nav>
    </header>
  );
}