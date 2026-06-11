import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export default function ProductForm({
  initialValues = {},
  categories = [],
  onSubmit,
  submitting = false,
}) {
  const defaults = useMemo(
    () => ({
      title: initialValues.title ?? initialValues.name ?? "",
      description: initialValues.description ?? "",
      price: initialValues.price ?? "",
      stock: initialValues.stock ?? "",
      category_id: initialValues.category_id ?? initialValues.category?.id ?? "",
      status: initialValues.status ?? "draft",
      flash_sale: Boolean(
        initialValues.flash_sale ?? initialValues.is_flash_sale
      ),
      flash_price: initialValues.flash_price ?? "",
      images: undefined,
    }),
    [initialValues]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: defaults });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const flashSale = watch("flash_sale");

  const submit = handleSubmit(async (values) => {
    const formData = new FormData();

    formData.append("name", values.title);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("category_id", values.category_id);
    formData.append("status", values.status);
    formData.append("flash_sale", values.flash_sale ? "1" : "0");

    if (values.flash_sale && values.flash_price) {
      formData.append("flash_price", values.flash_price);
    }

    if (values.images?.length) {
      Array.from(values.images).forEach((file) => {
        formData.append("images[]", file);
      });

      if (values.images[0]) {
        formData.append("image", values.images[0]);
      }
    }

    await onSubmit(formData, values);
  });

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
      <div style={card}>
        <label style={label}>Nom du produit</label>
        <input
          {...register("title", { required: "Le nom est obligatoire" })}
          style={input}
          placeholder="Ex: Sac premium"
        />
        {errors.title && <small style={error}>{errors.title.message}</small>}
      </div>

      <div style={card}>
        <label style={label}>Description</label>
        <textarea
          {...register("description", {
            required: "La description est obligatoire",
          })}
          style={{ ...input, minHeight: 120 }}
          placeholder="Description du produit"
        />
        {errors.description && (
          <small style={error}>{errors.description.message}</small>
        )}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
      >
        <div style={card}>
          <label style={label}>Prix</label>
          <input
            type="number"
            {...register("price", {
              required: "Le prix est obligatoire",
              min: 1,
            })}
            style={input}
          />
          {errors.price && <small style={error}>Prix invalide</small>}
        </div>

        <div style={card}>
          <label style={label}>Stock</label>
          <input
            type="number"
            {...register("stock", {
              required: "Le stock est obligatoire",
              min: 0,
            })}
            style={input}
          />
          {errors.stock && <small style={error}>Stock invalide</small>}
        </div>

        <div style={card}>
          <label style={label}>Catégorie</label>
          <select
            {...register("category_id", {
              required: "La catégorie est obligatoire",
            })}
            style={input}
          >
            <option value="">Sélectionner</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name ?? cat.title}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <small style={error}>{errors.category_id.message}</small>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={card}>
          <label style={label}>Statut</label>
          <select {...register("status")} style={input}>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="sold">sold</option>
          </select>
        </div>

        <div style={card}>
          <label style={label}>Images</label>
          <input type="file" multiple accept="image/*" {...register("images")} />
        </div>
      </div>

      <div style={card}>
        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="checkbox" {...register("flash_sale")} />
          Promotion flash
        </label>

        {flashSale ? (
          <div style={{ marginTop: 12 }}>
            <label style={label}>Prix promotionnel</label>
            <input type="number" {...register("flash_price")} style={input} />
          </div>
        ) : null}
      </div>

      <button type="submit" disabled={submitting} style={primaryBtn}>
        {submitting ? "Enregistrement..." : "Enregistrer le produit"}
      </button>
    </form>
  );
}

const card = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 16,
};

const label = {
  display: "block",
  marginBottom: 8,
  fontWeight: 600,
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const error = {
  color: "#b91c1c",
  display: "block",
  marginTop: 6,
};

const primaryBtn = {
  background: "#111827",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: 700,
};
