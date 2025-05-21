import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '5rem auto', padding: '3rem 2rem', textAlign: 'center' }}>
        <h1 className="font-heading weight-bold mb-4" style={{ fontSize: '3rem', color: 'var(--color-primary-dark)' }}>404</h1>
        <h2 className="font-heading mb-4">Página no encontrada</h2>
        <p className="mb-5">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
