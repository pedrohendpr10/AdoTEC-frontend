import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import { PageSpinner } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/pets/Pagination';
import { usePagedResource } from '../hooks/usePagedResource';
import { getMyAppointments, cancelAppointment } from '../api/appointmentsApi';
import { parseApiError } from '../api/errors';
import { formatDate, formatTime, appointmentStatus } from '../utils/format';
import { useToast } from '../context/ToastContext';

/** Lista os agendamentos do usuário logado, com opção de cancelar. */
export default function MyAppointmentsPage() {
  const toast = useToast();
  const { content, pagination, loading, error, setPage, reload } =
    usePagedResource(getMyAppointments);

  const [toCancel, setToCancel] = useState(null); // appointment selecionado
  const [canceling, setCanceling] = useState(false);

  const handleCancel = async () => {
    if (!toCancel) return;
    setCanceling(true);
    try {
      await cancelAppointment(toCancel.appointmentId);
      toast.success('Agendamento cancelado.');
      setToCancel(null);
      reload();
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setCanceling(false);
    }
  };

  const canCancel = (status) => status === 'PENDING' || status === 'CONFIRMED';

  return (
    <div className="page">
      <div className="container">
        <h1>Meus agendamentos</h1>
        <p className="muted" style={{ marginBottom: '1.5rem' }}>
          Acompanhe e gerencie suas visitas agendadas.
        </p>

        {error && <Alert type="error">{error.message}</Alert>}

        {loading ? (
          <PageSpinner />
        ) : content.length === 0 ? (
          <EmptyState
            icon="📅"
            title="Você ainda não tem agendamentos"
            message="Conheça os pets disponíveis e marque sua primeira visita."
          >
            <Link to="/pets">
              <Button variant="primary">Ver pets</Button>
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="appointment-list">
              {content.map((appt) => {
                const status = appointmentStatus(appt.status);
                return (
                  <article
                    key={appt.appointmentId}
                    className="card appointment-card"
                  >
                    <div className="appointment-card__main">
                      <span className="appointment-card__pet">
                        {appt.petName}
                      </span>
                      <span className="muted">
                        Visita em {formatDate(appt.timeSlot?.date)} às{' '}
                        {formatTime(appt.timeSlot?.startTime)}
                      </span>
                      {appt.notes && (
                        <span className="muted">Obs.: {appt.notes}</span>
                      )}
                    </div>

                    <div className="row">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      {canCancel(appt.status) && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setToCancel(appt)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            <Pagination pagination={pagination} onChange={setPage} />
          </>
        )}
      </div>

      {/* Confirmação de cancelamento */}
      <Modal
        open={!!toCancel}
        onClose={() => setToCancel(null)}
        title="Cancelar agendamento"
        footer={
          <>
            <Button variant="ghost" onClick={() => setToCancel(null)}>
              Voltar
            </Button>
            <Button variant="danger" loading={canceling} onClick={handleCancel}>
              Sim, cancelar
            </Button>
          </>
        }
      >
        <p>
          Tem certeza de que deseja cancelar a visita a{' '}
          <strong>{toCancel?.petName}</strong>? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  );
}
