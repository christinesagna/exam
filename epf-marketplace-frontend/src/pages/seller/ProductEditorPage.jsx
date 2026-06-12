import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import SellerShell from "../../components/seller/SellerShell";
import ProductForm from "../../components/seller/ProductForm";
import {
  createProduct,
  getCategories,
  getOwnProduct,
  updateProduct,
} from "../../services/productService";

const unwrap = (payload) => payload?.data ?? payload?.product ?? payload;

const extractCategories = (payload) => {
  const root = payload?.data ?? payload;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.data)) return root.data;
  if (Array.isArray(root?.categories)) return root.categories;
  return [];
};

export default function ProductEditorPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEdit = Boolean(productId);

  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const requests = [getCategories()];
        if (isEdit) requests.push(getOwnProduct(productId));

        const results = await Promise.all(requests);

        setCategories(extractCategories(results[0]));

        if (isEdit) {
          setInitialValues(unwrap(results[1]));
        }
      } catch (error) {
        toast.error("Impossible de charger le formulaire produit");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isEdit, productId]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);

      if (isEdit) {
        await updateProduct(productId, formData);
        toast.success("Produit mis à jour");
      } else {
        await createProduct(formData);
        toast.success("Produit créé");
      }

      navigate("/seller/products");
    } catch (error) {
      toast.error("Impossible d'enregistrer le produit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SellerShell
      title={isEdit ? "Modifier le produit" : "Ajouter un produit"}
      subtitle="Formulaire vendeur avec validation et upload d’images"
    >
      {loading ? (
        <div>Chargement du formulaire...</div>
      ) : (
        <ProductForm
          initialValues={initialValues}
          categories={categories}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </SellerShell>
  );
}
