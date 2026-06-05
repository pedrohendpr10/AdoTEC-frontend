import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageSpinner } from '../../components/ui/Spinner';
import StatCard from '../../components/admin/StatCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getPets } from '../../api/petsApi';
import {
  getAllAppointments,
  getMyAppointments,
  getUnassignedAppointments,
} from '../../api/appointmentsApi';
import { getEmployees } from '../../api/employeesApi';
import { useAuth } from '../../context/AuthContext';
import { todayISO, formatDate, formatTime, appointmentStatus } from '../../utils/format';

/**
 * Painel inicial — métricas e atalhos.
 *
 * ADMIN: vê números globais (todos os agendamentos, todos os pets) e lista operacional.
 * EMPLOYEE (sem ROLE_ADMIN): vê só os agendamentos atribuídos a ele.
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [unassignedList, setUnassignedList] = useState([]);
  const [stats, setStats] = useState({
    petsTotal: 0,
    appointmentsTotal: 0,
    pendingToday: 0,
    pendingTotal: 0,
    employeesTotal: 0,
    unassignedTotal: 0,
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

        // Funcionários e não atribuídos: apenas ADMIN busca essa informação.
        let employeesTotal = 0;
        let unassignedTotal = 0;
        let fetchedUnassignedList = [];

        if (isAdmin) {
          try {
            const empList = await getEmployees();
            employeesTotal = empList?.length ?? 0;

            const unassignedPage = await getUnassignedAppointments({ page: 0, size: 5 });
            fetchedUnassignedList = unassignedPage.content || [];
            unassignedTotal = unassignedPage.pagination?.totalElements ?? 0;
          } catch { /* ignora se falhar */ }
        }

        setStats({
          petsTotal: petsPage.pagination?.totalElements ?? 0,
          appointmentsTotal: apptPage.pagination?.totalElements ?? 0,
          pendingToday,
          pendingTotal,
          employeesTotal,
          unassignedTotal,
        });
        setUnassignedList(fetchedUnassignedList);
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
        {isAdmin && (
          <StatCard
            icon="⚠️"
            value={stats.unassignedTotal}
            label="Não atribuídos"
            accent="danger"
          />
        )}
      </div>

      {isAdmin && (
        <section className="card" style={{ marginTop: '2rem' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1.5px solid var(--color-border-strong)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Agendamentos para atribuir</h3>
            <p className="muted" style={{ fontSize: 'var(--font-size-sm)' }}>
              Agendamentos que ainda precisam de um funcionário responsável.
            </p>
          </div>

          <div style={{ padding: '0' }}>
            {unassignedList.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Nenhum agendamento pendente de atribuição no momento.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data / hora</th>
                    <th>Pet</th>
                    <th>Adotante</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {unassignedList.map((appt) => {
                    const status = appointmentStatus(appt.status);
                    return (
                      <tr key={appt.appointmentId}>
                        <td>
                          <strong>{formatDate(appt.timeSlot?.date)}</strong>
                          <br />
                          <span className="muted">
                            {formatTime(appt.timeSlot?.startTime)} —{' '}
                            {formatTime(appt.timeSlot?.endTime)}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--color-warning)', marginRight: '6px' }}></span>
                          {appt.petName}
                        </td>
                        <td>{appt.adopterName}</td>
                        <td>
                          <Badge variant={status.variant}>{status.label}</Badge>
                          <br />
                          <span className="muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                            Não atribuído
                          </span>
                        </td>
                        <td>
                          <div className="data-table__actions">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/painel/agendamentos/${appt.appointmentId}`,
                                )
                              }
                            >
                              Atribuir funcionário
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {stats.unassignedTotal > 5 && (
            <div style={{ padding: '1rem 1.5rem', borderTop: '1.5px solid var(--color-border-strong)', textAlign: 'center' }}>
              <Link to="/painel/agendamentos?employeeId=unassigned" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>
                Ver todos os agendamentos não atribuídos →
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
