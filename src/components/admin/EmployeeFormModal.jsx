import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { createEmployee, updateEmployee } from '../../api/employeesApi';
import { parseApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';

/**
 * Modal para criar ou editar um funcionário (ADMIN only).
 *
 * - Se `employee` for null → modo criação (com campo de senha).
 * - Se `employee` for preenchido → modo edição (sem alterar senha).
 */
export default function EmployeeFormModal({ open, onClose, employee, onSaved }) {
  const toast = useToast();
  const isEditing = !!employee;

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Preenche o form ao abrir em modo edição.
  useEffect(() => {
    if (!open) return;
    setError(null);
    if (employee) {
      setForm({
        name: employee.name ?? '',
        email: employee.email ?? '',
        password: '',
        role: employee.roles?.includes('ROLE_ADMIN') ? 'ADMIN' : 'EMPLOYEE',
      });
    } else {
      setForm({ name: '', email: '', password: '', role: 'EMPLOYEE' });
    }
  }, [open, employee]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (isEditing) {
        await updateEmployee(employee.id, {
          name: form.name,
          email: form.email,
        });
        toast.success('Funcionário atualizado.');
      } else {
        await createEmployee({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        toast.success('Funcionário criado com sucesso.');
      }
      onSaved?.();
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = form.name.trim() && form.email.trim() && (isEditing || form.password.trim());

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar funcionário' : 'Novo funcionário'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            loading={submitting}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </>
      }
    >
      <div className="stack">
        <Input
          label="Nome"
          name="emp-name"
          value={form.name}
          onChange={handleChange('name')}
          placeholder="Ex.: Maria Silva"
        />
        <Input
          label="E-mail"
          name="emp-email"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          placeholder="Ex.: maria@adotec.com"
        />

        {!isEditing && (
          <Input
            label="Senha"
            name="emp-password"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Mínimo 6 caracteres"
          />
        )}

        <div className="field">
          <label className="field__label" htmlFor="emp-role">
            Cargo
          </label>
          <select
            id="emp-role"
            className="field__control"
            value={form.role}
            onChange={handleChange('role')}
            disabled={isEditing}
          >
            <option value="EMPLOYEE">Funcionário</option>
            <option value="ADMIN">Administrador</option>
          </select>
          {isEditing && (
            <span className="field__hint">
              O cargo não pode ser alterado após a criação.
            </span>
          )}
        </div>

        {error && <Alert type="error">{error}</Alert>}
      </div>
    </Modal>
  );
}
