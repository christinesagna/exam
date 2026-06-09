export const rules = {
  name: {
    required: "Le nom complet est requis.",
    minLength: {
      value: 2,
      message: "Le nom doit contenir au moins 2 caractères.",
    },
  },
  email: {
    required: "L'email est requis.",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Veuillez saisir une adresse email valide.",
    },
  },
  password: {
    required: "Le mot de passe est requis.",
    minLength: {
      value: 6,
      message: "Le mot de passe doit contenir au moins 6 caractères.",
    },
  },
  confirmPassword: (getValues) => ({
    required: "La confirmation du mot de passe est requise.",
    validate: (value) =>
      value === getValues("password") || "Les mots de passe ne correspondent pas.",
  }),
};
