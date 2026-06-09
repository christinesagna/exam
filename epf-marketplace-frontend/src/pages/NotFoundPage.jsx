import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="page-section narrow-page">
      <div className="empty-state">
        <h1>404</h1>
        <p>Page introuvable.</p>
        <Link className="btn btn-primary" to="/buyer/cart">Aller au panier</Link>
      </div>
    </section>
  );
}
