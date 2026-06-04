import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/Button";
import ErrorMessage from "../../components/ui/ErrorMessage";
import FormField from "../../forms/FormField";
import { rules } from "../../forms/rules";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "buyer",
      phone: "",
      city: "",
      bio: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (values) => {
    try {
      setApiError("");
      await registerUser(values);
      toast.auth.registerSuccess();
      navigate("/profile", { replace: true });
    } catch (error) {
      const backendErrors = error?.response?.data?.errors;
      const backendMessage = error?.response?.data?.message;

      if (backendErrors?.email?.length) {
        setApiError(backendErrors.email[0]);
      } else {
        setApiError(backendMessage || "Une erreur est survenue. Veuillez réessayer.");
      }
      toast.auth.registerError();
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <p className="eyebrow"></p>
          <h1>Créer un compte</h1>
          <p className="page-subtitle"></p>
        </div>

        {apiError && <ErrorMessage message={apiError} />}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-grid-two">
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
          </div>

          <div className="form-grid-two">
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
          </div>

          <div className="form-grid-two">
            <div>
              <label htmlFor="role">Rôle</label>
              <select id="role" className="form-input" {...register("role", { required: "Rôle requis" })}>
                <option value="buyer">Acheteur</option>
                <option value="seller">Vendeur</option>
              </select>
              {errors.role && <p className="field-error">{errors.role.message}</p>}
            </div>

            <FormField
              label="Téléphone"
              name="phone"
              type="text"
              placeholder="+221 ..."
              register={register}
              error={errors.phone}
              rules={{
                maxLength: { value: 32, message: "Maximum 32 caractères." },
              }}
            />
          </div>

          <div className="form-grid-two">
            <FormField
              label="Ville"
              name="city"
              type="text"
              placeholder="Dakar"
              register={register}
              error={errors.city}
              rules={{
                maxLength: { value: 120, message: "Maximum 120 caractères." },
              }}
            />

            <div>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                rows="4"
                className="form-input"
                placeholder="Présentez-vous en quelques lignes..."
                {...register("bio", {
                  maxLength: { value: 2000, message: "Maximum 2000 caractères." },
                })}
              />
              {errors.bio && <p className="field-error">{errors.bio.message}</p>}
            </div>
          </div>

          <Button type="submit" loading={isSubmitting} className="full-width">
            {isSubmitting ? "Création du compte..." : "Créer mon compte"}
          </Button>

          <p className="auth-footer-text">
            Déjà inscrit ? <Link to="/login">Se connecter</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;
