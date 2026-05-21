import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/** Esqueleto comum a todas as páginas: navbar fixa + conteúdo + rodapé. */
export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
