import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";

export default function RoleGuard({ allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader text="Contrôle des autorisations..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/forbidden" replace />;

  return <Outlet />;
}
