import { Outlet } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import AdminSidebar from './AdminSidebar';

/**
 * Esqueleto das telas administrativas.
 * Reaproveita a Navbar pública no topo e adiciona uma sidebar à esquerda.
 */
export default function AdminLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="admin-shell">
        <AdminSidebar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
