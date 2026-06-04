import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (values) => {
    try {
      setSuccess("");
      setApiError("");

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);

      if (values.profile_image?.[0]) {
        formData.append("profile_image", values.profile_image[0]);
      }

      await updateProfile(formData);
      setSuccess("Profil mis à jour avec succès.");
    } catch (error) {
      setApiError("Impossible de mettre à jour le profil.");
    }
  };

  return (
    <div>
      <h1>Mon profil</h1>

      <p><strong>Nom :</strong> {user?.name}</p>
      <p><strong>Email :</strong> {user?.email}</p>
      <p><strong>Rôle :</strong> {user?.role}</p>

      <hr />

      <h2>Modifier mon profil</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nom</label>
          <input {...register("name")} />
        </div>

        <div>
          <label>Email</label>
          <input type="email" {...register("email")} />
        </div>

        <div>
          <label>Image de profil</label>
          <input type="file" accept="image/*" {...register("profile_image")} />
        </div>

        {success && <p>{success}</p>}
        {apiError && <p>{apiError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
