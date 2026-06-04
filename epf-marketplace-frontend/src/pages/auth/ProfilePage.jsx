import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/Button";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  marginTop: 6,
};

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [apiError, setApiError] = useState("");

  const defaultValues = useMemo(
    () => ({
      name: user?.name || "",
      phone: user?.phone || "",
      city: user?.city || "",
      bio: user?.bio || "",
      profile_image: null,
    }),
    [user]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = async (values) => {
    try {
      setApiError("");

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone || "");
      formData.append("city", values.city || "");
      formData.append("bio", values.bio || "");

      if (values.profile_image?.[0]) {
        formData.append("profile_image", values.profile_image[0]);
      }

      await updateProfile(formData);
      toast.auth.profileUpdated();
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      setApiError(backendMessage || "Impossible de mettre à jour le profil.");
    }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Compte utilisateur</p>
          <h1>Mon profil</h1>
          <p className="page-subtitle">
           
          </p>
        </div>
      </div>

      <div className="profile-grid">
        <aside className="app-card profile-summary">
          <div className="profile-avatar">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.name} className="profile-avatar-image" />
            ) : (
              <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
            )}
          </div>

          <h2>{user?.name || "Utilisateur"}</h2>
          <p className="muted-text">{user?.email || "Aucun email"}</p>

          <div className="profile-meta-list">
            <div>
              <span>Rôle</span>
              <strong>{user?.role || "—"}</strong>
            </div>
            <div>
              <span>Téléphone</span>
              <strong>{user?.phone || "Non renseigné"}</strong>
            </div>
            <div>
              <span>Ville</span>
              <strong>{user?.city || "Non renseignée"}</strong>
            </div>
            <div>
              <span>Avis</span>
              <strong>{user?.total_reviews ?? 0}</strong>
            </div>
          </div>
        </aside>

        <div className="app-card">
          <h2 style={{ marginTop: 0 }}>Modifier le profil</h2>
          <p className="muted-text" style={{ marginTop: 0 }}>
            
          </p>

          {apiError && <ErrorMessage message={apiError} />}

          <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
            <div className="form-grid-two">
              <div>
                <label htmlFor="name">Nom complet</label>
                <input
                  id="name"
                  style={inputStyle}
                  {...register("name", {
                    required: "Le nom est requis.",
                    minLength: { value: 2, message: "Minimum 2 caractères." },
                  })}
                />
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="phone">Téléphone</label>
                <input
                  id="phone"
                  style={inputStyle}
                  {...register("phone", {
                    maxLength: { value: 32, message: "Maximum 32 caractères." },
                  })}
                />
                {errors.phone && <p className="field-error">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="form-grid-two">
              <div>
                <label htmlFor="city">Ville</label>
                <input
                  id="city"
                  style={inputStyle}
                  {...register("city", {
                    maxLength: { value: 120, message: "Maximum 120 caractères." },
                  })}
                />
                {errors.city && <p className="field-error">{errors.city.message}</p>}
              </div>

              <div>
                <label htmlFor="email_readonly">Email</label>
                <input id="email_readonly" style={{ ...inputStyle, background: "#f9fafb" }} value={user?.email || ""} readOnly />
              </div>
            </div>

            <div>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                rows="5"
                style={{ ...inputStyle, resize: "vertical" }}
                {...register("bio", {
                  maxLength: { value: 2000, message: "Maximum 2000 caractères." },
                })}
              />
              {errors.bio && <p className="field-error">{errors.bio.message}</p>}
            </div>

            <div>
              <label htmlFor="profile_image">Image de profil</label>
              <input
                id="profile_image"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                style={inputStyle}
                {...register("profile_image")}
              />
            </div>

            <div className="form-actions">
              <Button type="submit" loading={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
