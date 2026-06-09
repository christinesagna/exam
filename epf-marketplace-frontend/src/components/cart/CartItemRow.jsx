function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function CartItemRow({ item, onQuantityChange, onRemove, disabled }) {
  return (
    <article className="card cart-item-row">
      <div className="cart-item-media">
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <div className="image-placeholder">Aucune image</div>
        )}
      </div>

      <div className="cart-item-main">
        <div className="cart-item-head">
          <div>
            <h3>{item.name}</h3>
            {item.sku ? <p className="muted">SKU : {item.sku}</p> : null}
          </div>
          <strong>{formatPrice(item.subtotal)}</strong>
        </div>

        <div className="cart-item-actions">
          <label>
            Quantité
            <input
              type="number"
              min="1"
              value={item.quantity}
              disabled={disabled}
              onChange={(event) => onQuantityChange(item.id, Number(event.target.value))}
            />
          </label>

          <div className="price-stack">
            <span>PU : {formatPrice(item.unitPrice)}</span>
            {item.stock ? <span>Stock : {item.stock}</span> : null}
          </div>

          <button
            type="button"
            className="btn btn-danger"
            disabled={disabled}
            onClick={() => onRemove(item.id)}
          >
            Supprimer
          </button>
        </div>
      </div>
    </article>
  );
}
