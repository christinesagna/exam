import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

export default function LogoutPage() {
  const { logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const runLogout = async () => {
      await logout();
      toast.auth.logoutSuccess();
      navigate("/login", { replace: true });
    };

    runLogout();
  }, [logout, navigate, toast]);

  return <Loader text="Déconnexion en cours..." />;
}
