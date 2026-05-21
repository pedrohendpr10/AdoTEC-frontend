import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

/** Barra de navegação principal (fixa no topo). */
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Sessão encerrada.');
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    isActive ? 'navbar__link navbar__link--active' : 'navbar__link';

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-mark" aria-hidden="true">
            🐾
          </span>
          <span>
            Ado<span className="navbar__brand-accent">TEC</span>
          </span>
        </Link>

        <div className="navbar__links">
          <NavLink to="/" className={linkClass} end>
            Início
          </NavLink>
          <NavLink to="/pets" className={linkClass}>
            Adotar
          </NavLink>

          {isAuthenticated ? (
            <div className="navbar__user">
              <NavLink to="/meus-agendamentos" className={linkClass}>
                Meus agendamentos
              </NavLink>
              <span className="navbar__user-name">Olá, {user.name.split(' ')[0]}</span>
              <Button variant="accent" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          ) : (
            <div className="navbar__user">
              <NavLink to="/login" className={linkClass}>
                Entrar
              </NavLink>
              <Link to="/cadastro">
                <Button variant="accent" size="sm">
                  Criar conta
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
