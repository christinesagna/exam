import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";

export default function RoleGuard({ allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader text="Contrôle des autorisations..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  if (!allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to="/forbidden"
        replace
        state={{
          from: location,
          message: "Vous n’avez pas les droits d’accéder à cette ressource.",
        }}
      />
    );
  }

  return <Outlet />;
}
