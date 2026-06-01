import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import { PageSpinner } from '../../components/ui/Spinner';
import Pagination from '../../components/pets/Pagination';
import { usePagedResource } from '../../hooks/usePagedResource';
import {
  getAllAppointments,
  getMyAppointments,
} from '../../api/appointmentsApi';
import { useAuth } from '../../context/AuthContext';
import {
  formatDate,
  formatTime,
  appointmentStatus,
} from '../../utils/format';

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'COMPLETED', label: 'Concluídos' },
  { value: 'CANCELED', label: 'Cancelados' },
];

/**
 * Listagem de agendamentos no painel.
 * ADMIN    → vê todos (GET /appointments).
 * EMPLOYEE → vê apenas os atribuídos a ele (GET /appointments/me).
 */
export default function AppointmentsAdminPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');

  // Estabiliza a referência do fetcher para não disparar reload em cada render.
  const fetcher = useMemo(
    () => (isAdmin ? getAllAppointments : getMyAppointments),
    [isAdmin],
  );

  const { content, pagination, loading, error, setPage } = usePagedResource(
    fetcher,
    {},
  );

  // Filtro de status no cliente — o backend ainda não expõe um filtro nativo.
  const visible = statusFilter
    ? content.filter((a) => a.status === statusFilter)
    : content;

  return (
    <div className="admin-content">
      <header className="admin-content__header">
        <div>
          <h1>Agendamentos</h1>
          <p className="muted">
            {isAdmin
              ? 'Todos os agendamentos do Centro.'
              : 'Os agendamentos atribuídos a você.'}
          </p>
        </div>
      </header>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        {STATUS_FILTERS.map((s) => (
          <button
            key={s.value}
            type="button"
            className={`chip ${statusFilter === s.value ? 'chip--active' : ''}`}
            onClick={() => setStatusFilter(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && <Alert type="error">{error.message}</Alert>}

      {loading ? (
        <PageSpinner />
      ) : visible.length === 0 ? (
        <EmptyState
          icon="📅"
          title="Nenhum agendamento encontrado"
          message={
            statusFilter
              ? 'Tente outro filtro.'
              : isAdmin
              ? 'Ainda não há agendamentos no sistema.'
              : 'Você ainda não foi atribuído a nenhuma visita.'
          }
        />
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Data / hora</th>
                <th>Pet</th>
                <th>Adotante</th>
                <th>Funcionário</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((appt) => {
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
                    <td>{appt.petName}</td>
                    <td>{appt.adopterName}</td>
                    <td>
                      {appt.employeeName ?? (
                        <span className="muted">Não atribuído</span>
                      )}
                    </td>
                    <td>
                      <Badge variant={status.variant}>{status.label}</Badge>
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
                          Ver detalhes
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChange={setPage} />
        </>
      )}
    </div>
  );
}
