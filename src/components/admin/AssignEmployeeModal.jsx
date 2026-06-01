import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';
import { getEmployees } from '../../api/employeesApi';
import { assignEmployee } from '../../api/appointmentsApi';
import { parseApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';

/**
 * Modal para atribuir um funcionário a um agendamento (apenas ADMIN).
 */
export default function AssignEmployeeModal({
  open,
  onClose,
  appointmentId,
  onAssigned,
}) {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setLoadingList(true);
    setError(null);
    setSelectedId('');
    getEmployees()
      .then(setEmployees)
      .catch((err) => setError(parseApiError(err).message))
      .finally(() => setLoadingList(false));
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedId) return;
    setSubmitting(true);
    setError(null);
    try {
      await assignEmployee(appointmentId, selectedId);
      toast.success('Funcionário atribuído.');
      onAssigned?.();
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Atribuir funcionário"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            loading={submitting}
            disabled={!selectedId}
            onClick={handleSubmit}
          >
            Confirmar
          </Button>
        </>
      }
    >
      <div className="stack">
        <p className="muted">
          Selecione o funcionário responsável por acompanhar esta visita.
        </p>

        {loadingList ? (
          <Spinner small />
        ) : (
          <div className="field">
            <label className="field__label" htmlFor="employee-select">
              Funcionário
            </label>
            <select
              id="employee-select"
              className="field__control"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">— Selecione —</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
          </div>
        )}

        {!loadingList && employees.length === 0 && (
          <Alert type="warning">
            Nenhum funcionário cadastrado no sistema ainda.
          </Alert>
        )}

        {error && <Alert type="error">{error}</Alert>}
      </div>
    </Modal>
  );
}
