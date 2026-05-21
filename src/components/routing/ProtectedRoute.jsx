import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Protege rotas que exigem autenticação.
 *
 * - Sem login → redireciona para /login, guardando a rota de origem
 *   para retornar após autenticar.
 * - Com `role` informada, exige que o usuário a possua.
 */
export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && !hasRole(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
