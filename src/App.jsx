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

// Área administrativa
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import PetsAdminPage from './pages/admin/PetsAdminPage';
import PetFormPage from './pages/admin/PetFormPage';
import PetPhotosPage from './pages/admin/PetPhotosPage';
import AppointmentsAdminPage from './pages/admin/AppointmentsAdminPage';
import AppointmentDetailPage from './pages/admin/AppointmentDetailPage';
import EmployeesPage from './pages/admin/EmployeesPage';

const STAFF_ROLES = ['ROLE_ADMIN', 'ROLE_EMPLOYEE'];

/**
 * Mapa de rotas do AdoTEC.
 *
 * Públicas:        /, /pets, /pets/:id, /login, /cadastro
 * Adotante:        /meus-agendamentos
 * Painel (staff):  /painel, /painel/pets/*, /painel/agendamentos/*
 * Admin-only:      /painel/funcionarios
 */
export default function App() {
  return (
    <Routes>
      {/* ===== Site público + adotante ===== */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/pets" element={<CatalogPage />} />
        <Route path="/pets/:id" element={<PetDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route
          path="/meus-agendamentos"
          element={
            <ProtectedRoute>
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ===== Painel administrativo ===== */}
      <Route
        path="/painel"
        element={
          <ProtectedRoute roles={STAFF_ROLES}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />

        {/* Pets */}
        <Route path="pets" element={<PetsAdminPage />} />
        <Route path="pets/novo" element={<PetFormPage />} />
        <Route path="pets/:id/editar" element={<PetFormPage />} />
        <Route path="pets/:id/fotos" element={<PetPhotosPage />} />

        {/* Agendamentos */}
        <Route path="agendamentos" element={<AppointmentsAdminPage />} />
        <Route path="agendamentos/:id" element={<AppointmentDetailPage />} />

        {/* Apenas ADMIN — proteção extra dentro da rota */}
        <Route
          path="funcionarios"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <EmployeesPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
