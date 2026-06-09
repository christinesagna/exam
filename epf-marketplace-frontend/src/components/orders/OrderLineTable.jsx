function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function OrderLineTable({ lines = [] }) {
  return (
    <div className="table-wrapper">
      <table className="order-table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>PU</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.id}>
              <td>{line.name}</td>
              <td>{line.quantity}</td>
              <td>{formatPrice(line.unitPrice)}</td>
              <td>{formatPrice(line.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
