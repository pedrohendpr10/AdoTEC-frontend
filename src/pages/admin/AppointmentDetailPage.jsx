import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import { PageSpinner } from '../../components/ui/Spinner';
import AssignEmployeeModal from '../../components/admin/AssignEmployeeModal';
import RegisterResultModal from '../../components/admin/RegisterResultModal';
import { getAppointmentById } from '../../api/appointmentsApi';
import { parseApiError } from '../../api/errors';
import {
  formatDate,
  formatTime,
  appointmentStatus,
  adoptionResultLabel,
} from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

/** Detalhe de um agendamento + ações administrativas. */
export default function AppointmentDetailPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);

  const load = () =>
    getAppointmentById(id)
      .then(setAppointment)
      .catch((err) => setError(parseApiError(err)));

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <PageSpinner />;

  if (error) {
    return (
      <div className="admin-content">
        <EmptyState
          icon="🔍"
          title={
            error.status === 404
              ? 'Agendamento não encontrado'
              : 'Erro ao carregar'
          }
          message={error.message}
        >
          <Link to="/painel/agendamentos">
            <Button variant="primary">Voltar à lista</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  const status = appointmentStatus(appointment.status);
  const isFinished =
    appointment.status === 'COMPLETED' || appointment.status === 'CANCELED';

  return (
    <div className="admin-content">
      <Link to="/painel/agendamentos" className="muted">
        ← Voltar à lista
      </Link>

      <header
        className="admin-content__header"
        style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}
      >
        <div>
          <h1>Agendamento #{appointment.appointmentId}</h1>
          <p className="muted">
            Criado em{' '}
            {appointment.createdAt
              ? new Date(appointment.createdAt).toLocaleString('pt-BR')
              : '—'}
          </p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </header>

      <div
        className="card"
        style={{ padding: '1.5rem', marginBottom: '1.5rem' }}
      >
        <h3 style={{ marginBottom: '0.75rem' }}>Visita</h3>
        <ul className="info-list">
          <li>
            <span>Data</span>
            <span>{formatDate(appointment.timeSlot?.date)}</span>
          </li>
          <li>
            <span>Horário</span>
            <span>
              {formatTime(appointment.timeSlot?.startTime)} —{' '}
              {formatTime(appointment.timeSlot?.endTime)}
            </span>
          </li>
          <li>
            <span>Pet</span>
            <span>{appointment.petName}</span>
          </li>
          <li>
            <span>Adotante</span>
            <span>{appointment.adopterName}</span>
          </li>
          <li>
            <span>Funcionário</span>
            <span>
              {appointment.employeeName ?? (
                <span className="muted">Não atribuído</span>
              )}
            </span>
          </li>
          {appointment.adoptionResult && (
            <li>
              <span>Resultado</span>
              <span>{adoptionResultLabel(appointment.adoptionResult)}</span>
            </li>
          )}
        </ul>

        {appointment.notes && (
          <>
            <h4 style={{ marginTop: '1rem' }}>Observações</h4>
            <p style={{ marginTop: '0.25rem' }}>{appointment.notes}</p>
          </>
        )}
      </div>

      {isFinished ? (
        <Alert type="info">
          Este agendamento está finalizado e não aceita mais alterações.
        </Alert>
      ) : (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.75rem' }}>Ações</h3>
          <div className="row">
            {isAdmin && (
              <Button variant="outline" onClick={() => setAssignOpen(true)}>
                {appointment.employeeName
                  ? 'Trocar funcionário'
                  : 'Atribuir funcionário'}
              </Button>
            )}
            <Button variant="primary" onClick={() => setResultOpen(true)}>
              Registrar resultado
            </Button>
          </div>
          <p className="muted" style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
            O cancelamento só pode ser feito pelo próprio adotante.
          </p>
        </div>
      )}

      <AssignEmployeeModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        appointmentId={appointment.appointmentId}
        onAssigned={() => {
          setAssignOpen(false);
          load();
        }}
      />

      <RegisterResultModal
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        appointmentId={appointment.appointmentId}
        onRegistered={() => {
          setResultOpen(false);
          load();
        }}
      />
    </div>
  );
}
