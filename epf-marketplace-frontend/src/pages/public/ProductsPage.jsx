import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data?.data || data?.products || []);
      } catch (err) {
        setError("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Catalogue</h1>
      {products.length === 0 ? (
        <p>Aucun produit disponible.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.title || product.name} - {product.price || product.effective_price} FCFA
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductsPage;
