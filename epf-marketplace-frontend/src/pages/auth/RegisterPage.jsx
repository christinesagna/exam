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
    formState: { errors, isSubmitting },
  } = useForm();

const onSubmit = async (values) => {
  try {
    setApiError("");
    await registerUser(values);
    toast.auth.registerSuccess();      //  Toast succès
    navigate("/profile");
  } catch (error) {
    const status = error?.response?.status;
    if (status === 409) {
      const msg = "Un compte existe déjà avec cet email.";
      setApiError(msg);
      toast.error(msg);                //  Toast erreur 409
    } else {
      setApiError("Une erreur est survenue. Veuillez réessayer.");
      toast.auth.registerError();      //  Toast erreur générale
    }
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">

        {/* Titre */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-sm text-gray-500 mt-1">
            Rejoignez-nous, c'est gratuit !
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/*  Nom */}
          <FormField
            label="Nom complet"
            name="name"
            type="text"
            placeholder="Saliou Diallo"
            register={register}
            error={errors.name}
            rules={rules.name}
          />

          {/*  Email */}
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="saliou@exemple.com"
            register={register}
            error={errors.email}
            rules={rules.email}
          />

          {/*  Mot de passe */}
          <FormField
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password}
            rules={rules.password}
          />

          {/* ✅ Confirmation mot de passe */}
          <FormField
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.confirmPassword}
            rules={rules.confirmPassword(getValues)}
          />

          {/* ✅ Erreur API */}
          <ErrorMessage
            message={apiError}
            onClose={() => setApiError("")}
          />

          {/* ✅ Bouton */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            className="w-full mt-2"
          >
            Créer mon compte
          </Button>

        </form>

        {/* Lien vers login */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;