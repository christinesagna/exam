import toast from "react-hot-toast";

export function useToast() {
  return {
    success: (msg) => toast.success(msg),
    error:   (msg) => toast.error(msg),
    loading: (msg) => toast.loading(msg),
    dismiss: ()    => toast.dismiss(),
    
    auth: {
      loginSuccess:    () => toast.success("Bienvenue ! Connexion réussie."),
      loginError:      () => toast.error("Identifiants invalides."),
      registerSuccess: () => toast.success("Compte créé avec succès !"),
      registerError:   () => toast.error("Erreur lors de l'inscription."),
      logoutSuccess:   () => toast.success("Vous êtes déconnecté."),
      unauthorized:    () => toast.error("Accès refusé. Veuillez vous connecter."),
      suspended:       () => toast.error("Votre compte est suspendu."),
      profileUpdated:  () => toast.success("Profil mis à jour avec succès."),
    },
  };
}