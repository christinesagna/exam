import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [apiError, setApiError] = useState("");

  const redirectTo = location.state?.from?.pathname || "/profile";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      setApiError("");
      await login(values);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const status = error?.response?.status;

      if (status === 403) {
        setApiError("Compte suspendu ou accès refusé.");
      } else {
        setApiError("Email ou mot de passe invalide.");
      }
    }
  };

  return (
    <div>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "Email requis" })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            {...register("password", { required: "Mot de passe requis" })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {apiError && <p>{apiError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
