import { useAuth } from "../../context/AuthContext";
import BuyerDashboard from "./BuyerDashboard";
import SellerDashboard from "./SellerDashboard";

export default function DashboardRouter() {
  const { user } = useAuth();

  if (user?.role === "buyer") return <BuyerDashboard />;
  if (user?.role === "seller") return <SellerDashboard />;

  return <p>Loading...</p>;
}