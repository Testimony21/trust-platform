import { useAuth } from "../../context/AuthContext";
import BuyerDashboard from "./BuyerDashboard";
import SellerDashboard from "./SellerDashboard";
import OnboardingModal from "../../components/OnboardingModal/OnboardingModal";
import { useNavigate } from "react-router-dom";
import DashboardLoader from "../../components/DashboardLoader/DashboardLoader";
import { useEffect, useState } from "react";

export default function DashboardRouter() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

useEffect(() => {
    if (!user) return;

  const key = `onboarding_seen_${user.id || user._id}`;
    const seen = localStorage.getItem(key);

    if (!seen) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleCloseOnboarding = () => {
    const key = `onboarding_seen_${user.id || user._id}`;
    localStorage.setItem(key, "true");
    setShowOnboarding(false);
  };

  if (loading) return <DashboardLoader />;
  if (!user) return null;

  return (
    <>
      {showOnboarding && (
        <OnboardingModal
          role={user.role}
          onClose={handleCloseOnboarding}
        />
      )}

      {user.role === "buyer" && <BuyerDashboard />}
      {user.role === "seller" && <SellerDashboard />}
      {user.role !== "buyer" && user.role !== "seller" && (
        <p style={{ color: "white", padding: "40px" }}>Unknown role</p>
      )}
    </>
  );
}