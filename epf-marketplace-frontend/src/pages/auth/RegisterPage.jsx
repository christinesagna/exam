import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";

function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (values) => {
    try {
      setApiError("");
      await registerUser(values);
      navigate("/profile", { replace: true });
    } catch (error) {
      setApiError("Erreur lors de l'inscription.");
    }
  };

  return (
    <div>
      <h1>Inscription</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nom</label>
          <input {...register("name", { required: "Nom requis" })} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

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
            {...register("password", {
              required: "Mot de passe requis",
              minLength: {
                value: 6,
                message: "6 caractères minimum",
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <label>Confirmation mot de passe</label>
          <input
            type="password"
            {...register("password_confirmation", {
              required: "Confirmation requise",
              validate: (value) =>
                value === password || "Les mots de passe ne correspondent pas",
            })}
          />
          {errors.password_confirmation && (
            <p>{errors.password_confirmation.message}</p>
          )}
        </div>

        <div>
          <label>Rôle</label>
          <select {...register("role", { required: "Rôle requis" })}>
            <option value="">Choisir</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          {errors.role && <p>{errors.role.message}</p>}
        </div>

        {apiError && <p>{apiError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
