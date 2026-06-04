import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { rules } from "../../forms/rules";
import FormField from "../../forms/FormField";
import { useToast } from "../../hooks/useToast";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Button from "../../components/ui/Button";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bienvenue ! Entrez vos identifiants.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="saliou@exemple.com"
            register={register}
            error={errors.email}
            rules={rules.email}
=======
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email requis',
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            {...register("password", { required: "Mot de passe requis" })}
>>>>>>> 374d4685bcc94052bd99d5e0a17db72eee1a5fbb
          />

          {/* ✅ Mot de passe — FormField + règle centralisée */}
          <FormField
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password}
            rules={rules.password}
          />

<<<<<<< HEAD
          {/* ✅ Erreur API */}
          <ErrorMessage
            message={apiError}
            onClose={() => setApiError("")}
          />

          {/* ✅ Bouton — composant centralisé */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            className="w-full mt-2"
          >
            Se connecter
          </Button>

        </form>

        {/* Lien vers register */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            S'inscrire
          </Link>
        </p>

      </div>
=======
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>
>>>>>>> 374d4685bcc94052bd99d5e0a17db72eee1a5fbb
    </div>
  );
}

export default LoginPage;