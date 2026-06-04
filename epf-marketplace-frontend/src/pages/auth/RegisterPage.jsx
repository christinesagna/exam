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
<<<<<<< HEAD
            placeholder="saliou@exemple.com"
            register={register}
            error={errors.email}
            rules={rules.email}
=======
            {...register("email", { required: "Email requis" })}
>>>>>>> 374d4685bcc94052bd99d5e0a17db72eee1a5fbb
          />

          {/*  Mot de passe */}
          <FormField
            label="Mot de passe"
            name="password"
            type="password"
<<<<<<< HEAD
            placeholder="••••••••"
            register={register}
            error={errors.password}
            rules={rules.password}
=======
            {...register("password", {
              required: "Mot de passe requis",
              minLength: {
                value: 6,
                message: "6 caractères minimum",
              },
            })}
>>>>>>> 374d4685bcc94052bd99d5e0a17db72eee1a5fbb
          />

<<<<<<< HEAD
          {/* ✅ Confirmation mot de passe */}
          <FormField
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.confirmPassword}
            rules={rules.confirmPassword(getValues)}
=======
        <div>
          <label>Confirmation mot de passe</label>
          <input
            type="password"
            {...register("password_confirmation", {
              required: "Confirmation requise",
              validate: (value) =>
                value === password || "Les mots de passe ne correspondent pas",
            })}
>>>>>>> 374d4685bcc94052bd99d5e0a17db72eee1a5fbb
          />

<<<<<<< HEAD
          {/* ✅ Erreur API */}
          <ErrorMessage
            message={apiError}
            onClose={() => setApiError("")}
          />
=======
        <div>
          <label>Rôle</label>
          <select {...register("role", { required: "Rôle requis" })}>
            <option value="">Choisir</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          {errors.role && <p>{errors.role.message}</p>}
        </div>
>>>>>>> 374d4685bcc94052bd99d5e0a17db72eee1a5fbb

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

<<<<<<< HEAD
        </form>

        {/* Lien vers login */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>

      </div>
=======
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
>>>>>>> 374d4685bcc94052bd99d5e0a17db72eee1a5fbb
    </div>
  );
}

export default RegisterPage;