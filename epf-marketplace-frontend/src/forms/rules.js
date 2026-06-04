export const rules = {
  name: {
    required: "Le nom est requis.",
    minLength: { value: 2, message: "Minimum 2 caractères." },
  },
  email: {
    required: "L'email est requis.",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email invalide.",
    },
  },
  password: {
    required: "Le mot de passe est requis.",
    minLength: { value: 6, message: "Minimum 6 caractères." },
  },
};
