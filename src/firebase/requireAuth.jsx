import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

export default function RequireAuth({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <p style={{ padding: 20 }}>Loading auth...</p>;

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}
