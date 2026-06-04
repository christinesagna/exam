import { toast } from "react-hot-toast";

const auth = {
  loginSuccess: () => toast.success("Connexion réussie."),
  loginError: () => toast.error("Impossible de se connecter."),
  suspended: () => toast.error("Compte suspendu ou droits insuffisants."),
  registerSuccess: () => toast.success("Inscription réussie."),
  registerError: () => toast.error("Impossible de créer le compte."),
  profileUpdated: () => toast.success("Profil mis à jour."),
  logoutSuccess: () => toast.success("Déconnexion réussie."),
};

export function useToast() {
  return {
    auth,
    success: toast.success,
    error: toast.error,
    info: toast,
  };
}
