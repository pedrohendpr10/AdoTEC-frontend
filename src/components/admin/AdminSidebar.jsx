import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Menu lateral do painel administrativo.
 * Esconde "Funcionários" para quem não for ADMIN.
 */
export default function AdminSidebar() {
  const { isAdmin } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive ? 'admin-nav__link admin-nav__link--active' : 'admin-nav__link';

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__title">Painel</div>
      <nav className="admin-nav">
        <NavLink to="/painel" end className={linkClass}>
          <span aria-hidden="true">📊</span> Dashboard
        </NavLink>
        <NavLink to="/painel/pets" className={linkClass}>
          <span aria-hidden="true">🐾</span> Pets
        </NavLink>
        <NavLink to="/painel/agendamentos" className={linkClass}>
          <span aria-hidden="true">📅</span> Agendamentos
        </NavLink>
        {isAdmin && (
          <NavLink to="/painel/funcionarios" className={linkClass}>
            <span aria-hidden="true">👥</span> Funcionários
          </NavLink>
        )}
      </nav>
      <div className="admin-sidebar__footer">
        <a href="/" className="admin-nav__link admin-nav__link--ghost">
          ← Voltar ao site
        </a>
      </div>
    </aside>
  );
}
