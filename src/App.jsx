import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/routing/ProtectedRoute';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import PetDetailPage from './pages/PetDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Mapa de rotas do AdoTEC.
 *
 * Públicas:    /, /pets, /pets/:id, /login, /cadastro
 * Protegidas:  /meus-agendamentos (exige login)
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pets" element={<CatalogPage />} />
        <Route path="/pets/:id" element={<PetDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />

        {/* Protegidas */}
        <Route
          path="/meus-agendamentos"
          element={
            <ProtectedRoute>
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
