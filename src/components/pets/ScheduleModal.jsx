import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';
import { getTimeSlotsByDate } from '../../api/timeslotsApi';
import { createAppointment } from '../../api/appointmentsApi';
import { parseApiError } from '../../api/errors';
import { formatTime, todayISO } from '../../utils/format';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

/**
 * Modal de agendamento de visita.
 *
 * Fluxo: o adotante escolhe uma data → buscamos os horários disponíveis
 * daquele dia → ele seleciona um horário → confirmamos o agendamento.
 *
 * Proteção: apenas usuários com ROLE_ADOPTER podem abrir este modal.
 * Mesmo que o prop `open` seja forçado via DOM, o componente não renderiza
 * para outros perfis.
 */
export default function ScheduleModal({ open, onClose, pet, onScheduled }) {
  const { isAdopter } = useAuth();

  // Proteção explícita: funcionários e admins nunca veem o modal.
  if (!isAdopter) return null;
  const toast = useToast();
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => {
    setDate('');
    setSlots([]);
    setSelectedSlot(null);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDateChange = async (value) => {
    setDate(value);
    setSelectedSlot(null);
    setSlots([]);
    setError(null);
    if (!value) return;

    setLoadingSlots(true);
    try {
      const data = await getTimeSlotsByDate(value);
      setSlots(data);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setError(null);
    try {
      await createAppointment(pet.petId, selectedSlot.slotId);
      toast.success(`Visita a ${pet.petName} agendada com sucesso!`);
      reset();
      onScheduled?.();
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Agendar visita — ${pet?.petName ?? ''}`}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!selectedSlot}
            loading={submitting}
            onClick={handleConfirm}
          >
            Confirmar agendamento
          </Button>
        </>
      }
    >
      <div className="stack">
        <p className="muted">
          Escolha um dia e um horário disponível para conhecer{' '}
          <strong>{pet?.petName}</strong> no Centro de Zoonoses.
        </p>

        <Input
          type="date"
          label="Data da visita"
          min={todayISO()}
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
        />

        {loadingSlots && <Spinner small />}

        {date && !loadingSlots && slots.length === 0 && !error && (
          <Alert type="warning">
            Nenhum horário disponível nesta data. Tente outro dia.
          </Alert>
        )}

        {slots.length > 0 && (
          <div className="field">
            <span className="field__label">Horários disponíveis</span>
            <div className="timeslot-grid">
              {slots.map((slot) => (
                <button
                  key={slot.slotId}
                  type="button"
                  className={`chip ${
                    selectedSlot?.slotId === slot.slotId ? 'chip--active' : ''
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {formatTime(slot.startTime)}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <Alert type="error">{error}</Alert>}
      </div>
    </Modal>
  );
}
