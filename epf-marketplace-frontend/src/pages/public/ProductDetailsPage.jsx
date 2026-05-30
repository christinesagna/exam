import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../../services/productService';

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await productService.getById(id);
      setProduct(data?.data || data?.product || data);
    };

    loadProduct();
  }, [id]);

  if (!product) return <p>Chargement...</p>;

  return (
    <div>
      <h1>{product.title || product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}

export default ProductDetailsPage;
