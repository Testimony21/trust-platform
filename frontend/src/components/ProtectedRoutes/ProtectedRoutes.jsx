import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLoader from "../DashboardLoader/DashboardLoader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <DashboardLoader />;
  }

  return user ? children : <Navigate to="/login" replace />;
}