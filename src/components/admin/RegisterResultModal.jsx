import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { registerResult } from '../../api/appointmentsApi';
import { parseApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';

/**
 * Modal para registrar o resultado de uma visita (ADMIN ou EMPLOYEE).
 * Body enviado: { result: 'APPROVED' | 'REJECTED', notes?: string }
 */
export default function RegisterResultModal({
  open,
  onClose,
  appointmentId,
  onRegistered,
}) {
  const toast = useToast();
  const [result, setResult] = useState('APPROVED');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => {
    setResult('APPROVED');
    setNotes('');
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await registerResult(appointmentId, result, notes.trim() || null);
      toast.success(
        result === 'APPROVED'
          ? 'Adoção aprovada! 🐾'
          : 'Resultado registrado.',
      );
      reset();
      onRegistered?.();
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
      title="Registrar resultado da visita"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            loading={submitting}
            onClick={handleSubmit}
          >
            Registrar resultado
          </Button>
        </>
      }
    >
      <div className="stack">
        <p className="muted">
          O agendamento será marcado como <strong>concluído</strong>. Se aprovado,
          o pet será removido das listagens públicas.
        </p>

        <div className="field">
          <span className="field__label">Resultado</span>
          <div className="chip-group">
            <button
              type="button"
              className={`chip ${result === 'APPROVED' ? 'chip--active' : ''}`}
              onClick={() => setResult('APPROVED')}
            >
              ✅ Aprovada
            </button>
            <button
              type="button"
              className={`chip ${result === 'REJECTED' ? 'chip--active' : ''}`}
              onClick={() => setResult('REJECTED')}
            >
              ❌ Não aprovada
            </button>
          </div>
        </div>

        <Input
          label="Observações"
          name="notes"
          as="textarea"
          rows="4"
          placeholder="Anote o que aconteceu na visita..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          hint="Opcional"
        />

        {error && <Alert type="error">{error}</Alert>}
      </div>
    </Modal>
  );
}
