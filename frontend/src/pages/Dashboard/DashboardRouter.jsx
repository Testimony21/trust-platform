import { useAuth } from "../../context/AuthContext";
import BuyerDashboard from "./BuyerDashboard";
import SellerDashboard from "./SellerDashboard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function DashboardRouter() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

  if (loading) return <p style={{ color: "white", padding: "40px" }}>Loading...</p>;
  if (!user) return null;

  if (user.role === "buyer") return <BuyerDashboard />;
  if (user.role === "seller") return <SellerDashboard />;

  return <p style={{ color: "white", padding: "40px" }}>Unknown role</p>;
}