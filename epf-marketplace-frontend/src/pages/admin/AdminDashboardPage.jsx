import { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { getProducts } from "../../services/productService";

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  const columns = [
    { key: "name",  label: "Produit" },
    { key: "price", label: "Prix", render: (row) => `${row.price} €` },
    { key: "status", label: "Statut",
      render: (row) => <Badge variant="success">{row.status}</Badge> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Produits</h1>

      {/* ✅ Colle le composant Table ici */}
      <Table columns={columns} data={products} loading={isLoading} />
    </div>
  );

  

export default AdminDashboardPage;
