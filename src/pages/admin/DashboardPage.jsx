import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageSpinner } from '../../components/ui/Spinner';
import StatCard from '../../components/admin/StatCard';
import Button from '../../components/ui/Button';
import { getPets } from '../../api/petsApi';
import {
  getAllAppointments,
  getMyAppointments,
} from '../../api/appointmentsApi';
import { getEmployees } from '../../api/employeesApi';
import { useAuth } from '../../context/AuthContext';
import { todayISO } from '../../utils/format';

/**
 * Painel inicial — métricas e atalhos.
 *
 * ADMIN: vê números globais (todos os agendamentos, todos os pets).
 * EMPLOYEE (sem ROLE_ADMIN): vê só os agendamentos atribuídos a ele.
 */
export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    petsTotal: 0,
    appointmentsTotal: 0,
    pendingToday: 0,
    pendingTotal: 0,
    employeesTotal: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        // Pets disponíveis (todos podem ver). Apenas a 1ª página é necessária
        // para pegar o totalElements.
        const petsPage = await getPets({ page: 0 });

        // Agendamentos: ADMIN vê tudo; EMPLOYEE vê só os atribuídos.
        const apptPage = isAdmin
          ? await getAllAppointments({ page: 0, size: 50 })
          : await getMyAppointments({ page: 0, size: 50 });

        const today = todayISO();
        const items = apptPage.content ?? [];
        const pendingToday = items.filter(
          (a) =>
            a.status === 'PENDING' && a.timeSlot?.date === today,
        ).length;
        const pendingTotal = items.filter((a) => a.status === 'PENDING').length;

        // Funcionários: apenas ADMIN busca essa informação.
        let employeesTotal = 0;
        if (isAdmin) {
          try {
            const empList = await getEmployees();
            employeesTotal = empList?.length ?? 0;
          } catch { /* ignora se falhar */ }
        }

        setStats({
          petsTotal: petsPage.pagination?.totalElements ?? 0,
          appointmentsTotal: apptPage.pagination?.totalElements ?? 0,
          pendingToday,
          pendingTotal,
          employeesTotal,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAdmin]);

  if (loading) return <PageSpinner />;

  return (
    <div className="admin-content">
      <header className="admin-content__header">
        <div>
          <h1>Olá, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="muted">
            {isAdmin
              ? 'Visão geral do Centro de Adoção.'
              : 'Resumo das suas visitas atribuídas.'}
          </p>
        </div>
        <div className="row">
          <Link to="/painel/pets/novo">
            <Button variant="primary">+ Novo pet</Button>
          </Link>
        </div>
      </header>

      <div className="stat-grid">
        {isAdmin && (
          <StatCard
            icon="👥"
            value={stats.employeesTotal}
            label="Funcionários"
            accent="primary"
          />
        )}
        <StatCard
          icon="🐾"
          value={stats.petsTotal}
          label="Pets disponíveis"
          accent="primary"
        />
        <StatCard
          icon="📅"
          value={stats.appointmentsTotal}
          label={isAdmin ? 'Total de agendamentos' : 'Meus agendamentos'}
          accent="dark"
        />
        <StatCard
          icon="⏳"
          value={stats.pendingTotal}
          label="Pendentes"
          accent="accent"
        />
        <StatCard
          icon="🗓️"
          value={stats.pendingToday}
          label="Pendentes para hoje"
          accent="danger"
        />
      </div>

      <section className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Acessos rápidos</h3>
        <div className="row">
          <Link to="/painel/pets">
            <Button variant="outline">Gerenciar pets</Button>
          </Link>
          <Link to="/painel/agendamentos">
            <Button variant="outline">Ver agendamentos</Button>
          </Link>
          {isAdmin && (
            <Link to="/painel/funcionarios">
              <Button variant="outline">Listar funcionários</Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
