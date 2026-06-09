import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { rules } from "../../forms/rules";
import FormField from "../../forms/FormField";
import { useToast } from "../../hooks/useToast";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Button from "../../components/ui/Button";

function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (values) => {
    try {
      setApiError("");
      await registerUser(values);
      toast.auth.registerSuccess();
      navigate("/profile", { replace: true });
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409) {
        const msg = "Un compte existe déjà avec cet email.";
        setApiError(msg);
        toast.error(msg);
      } else {
        setApiError("Une erreur est survenue. Veuillez réessayer.");
        toast.auth.registerError();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-sm text-gray-500 mt-1">
            Rejoignez-nous, c'est gratuit !
          </p>
        </div>

        {apiError && <ErrorMessage message={apiError} />}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            label="Nom complet"
            name="name"
            type="text"
            placeholder="Saliou Diallo"
            register={register}
            error={errors.name}
            rules={rules.name}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="votre@email.com"
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

          <FormField
            label="Confirmer le mot de passe"
            name="password_confirmation"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password_confirmation}
            rules={{
              required: "Confirmation requise",
              validate: (value) =>
                value === password || "Les mots de passe ne correspondent pas",
            }}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              {...register("role", { required: "Rôle requis" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choisir un rôle</option>
              <option value="buyer">Acheteur</option>
              <option value="seller">Vendeur</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            className="w-full mt-2"
          >
            Créer mon compte
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;