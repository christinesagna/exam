import { Link } from 'react-router-dom';

export default function AccessDeniedPage() {
  return (
    <section className="page-section narrow-page">
      <div className="empty-state">
        <h1>403</h1>
        <p>Droits insuffisants pour accéder à cette section.</p>
        <Link to="/buyer/cart" className="btn btn-primary">Retour</Link>
      </div>
    </section>
  );
}
