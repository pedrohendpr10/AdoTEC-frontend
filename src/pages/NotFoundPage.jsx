import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

/** Página 404 — rota inexistente. */
export default function NotFoundPage() {
  return (
    <div className="page container">
      <EmptyState
        icon="🐾"
        title="Página não encontrada"
        message="O endereço que você tentou acessar não existe."
      >
        <Link to="/">
          <Button variant="primary">Voltar ao início</Button>
        </Link>
      </EmptyState>
    </div>
  );
}
