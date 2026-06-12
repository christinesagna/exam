import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import SellerShell from "../../components/seller/SellerShell";
import ProductTable from "../../components/seller/ProductTable";
import { deleteProduct, getMyProducts } from "../../services/productService";

const extractProducts = (payload) => {
  const root = payload?.data ?? payload;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.items)) return root.items;
  if (Array.isArray(root?.data)) return root.data;
  if (Array.isArray(root?.products)) return root.products;
  return [];
};

export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = status === "all" ? {} : { status };
      const data = await getMyProducts(params);
      setProducts(extractProducts(data));
    } catch (error) {
      toast.error("Impossible de charger les produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [status]);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Supprimer le produit "${product.title ?? product.name}" ?`
    );

    if (!confirmed) return;

    try {
      await deleteProduct(product.id);
      toast.success("Produit supprimé");
      await loadProducts();
    } catch (error) {
      toast.error("Impossible de supprimer ce produit");
    }
  };

  const totalLabel = useMemo(() => `${products.length} produit(s)`, [products]);

  return (
    <SellerShell
      title="Mes produits"
      subtitle="Gestion complète du catalogue vendeur"
      actions={
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
            }}
          >
            <option value="all">Tous</option>
            <option value="draft">brouillon</option>
            <option value="published">publié</option>
            <option value="sold">vendu</option>
          </select>

          <Link
            to="/seller/products/new"
            style={{
              background: "#111827",
              color: "#fff",
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 10,
              fontWeight: 700,
            }}
          >
            + Nouveau produit
          </Link>
        </div>
      }
    >
      <div style={{ marginBottom: 16, color: "#6b7280" }}>{totalLabel}</div>

      {loading ? (
        <div>Chargement des produits...</div>
      ) : (
        <ProductTable products={products} onDelete={handleDelete} />
      )}
    </SellerShell>
  );
}
