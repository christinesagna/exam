import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/Button";
import ErrorMessage from "../../components/ui/ErrorMessage";
import FormField from "../../forms/FormField";
import { rules } from "../../forms/rules";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
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
      toast.auth.loginSuccess();
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const status = error?.response?.status;

      if (status === 403) {
        const msg = "Vous n'avez pas les droits ou votre compte est suspendu.";
        setApiError(msg);
        toast.auth.suspended();
      } else {
        setApiError("Identifiants invalides.");
        toast.auth.loginError();
      }
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow"></p>
          <h1>Connexion</h1>
          <p className="page-subtitle"></p>
        </div>

        {apiError && <ErrorMessage message={apiError} />}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="sa@exemple.com"
            register={register}
            error={errors.email}
            rules={rules.email}
          />

          <FormField
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password}
            rules={rules.password}
          />

          <Button type="submit" loading={isSubmitting} className="full-width">
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </Button>

          <p className="auth-footer-text">
            Pas encore inscrit ? <Link to="/register">Créer un compte</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
