import { useEffect, useState } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { PageSpinner } from '../../components/ui/Spinner';
import EmployeeFormModal from '../../components/admin/EmployeeFormModal';
import {
  getEmployees,
  toggleEmployeeActive,
} from '../../api/employeesApi';
import { parseApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';

/**
 * Gerenciamento de funcionários (ADMIN only).
 * CRUD completo: criar, editar, ativar/desativar.
 */
export default function EmployeesPage() {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal de criação/edição
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = criar, obj = editar

  // Modal de confirmação de desativação
  const [toToggle, setToToggle] = useState(null);
  const [toggling, setToggling] = useState(false);

  const load = () => {
    setLoading(true);
    getEmployees()
      .then(setEmployees)
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setFormOpen(true);
  };

  const handleFormSaved = () => {
    setFormOpen(false);
    setEditing(null);
    load();
  };

  const handleToggle = async () => {
    if (!toToggle) return;
    setToggling(true);
    try {
      await toggleEmployeeActive(toToggle.id);
      toast.success(
        toToggle.isActive
          ? `${toToggle.name} foi desativado.`
          : `${toToggle.name} foi reativado.`,
      );
      setToToggle(null);
      load();
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setToggling(false);
    }
  };

  const roleLabel = (roles) => {
    if (roles?.includes('ROLE_ADMIN')) return 'Administrador';
    if (roles?.includes('ROLE_EMPLOYEE')) return 'Funcionário';
    return '—';
  };

  return (
    <div className="admin-content">
      <header className="admin-content__header">
        <div>
          <h1>Funcionários</h1>
          <p className="muted">
            Gerencie os usuários com acesso ao painel interno.
          </p>
        </div>
        <div className="row">
          <Button variant="primary" onClick={handleCreate}>
            + Novo funcionário
          </Button>
        </div>
      </header>

      {error && <Alert type="error">{error.message}</Alert>}

      {loading ? (
        <PageSpinner />
      ) : employees.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Nenhum funcionário cadastrado"
          message="Clique em '+ Novo funcionário' para adicionar o primeiro."
        />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Cargo</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                style={!emp.isActive ? { opacity: 0.55 } : undefined}
              >
                <td>
                  <strong>{emp.name}</strong>
                </td>
                <td>{emp.email}</td>
                <td>
                  <Badge
                    variant={
                      emp.roles?.includes('ROLE_ADMIN') ? 'accent' : 'primary'
                    }
                  >
                    {roleLabel(emp.roles)}
                  </Badge>
                </td>
                <td>
                  <Badge variant={emp.isActive ? 'success' : 'danger'}>
                    {emp.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>
                <td>
                  <div className="data-table__actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(emp)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant={emp.isActive ? 'danger' : 'primary'}
                      size="sm"
                      onClick={() => setToToggle(emp)}
                    >
                      {emp.isActive ? 'Desativar' : 'Reativar'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de criação / edição */}
      <EmployeeFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        employee={editing}
        onSaved={handleFormSaved}
      />

      {/* Confirmação de ativação / desativação */}
      <Modal
        open={!!toToggle}
        onClose={() => setToToggle(null)}
        title={toToggle?.isActive ? 'Desativar funcionário' : 'Reativar funcionário'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setToToggle(null)}>
              Cancelar
            </Button>
            <Button
              variant={toToggle?.isActive ? 'danger' : 'primary'}
              loading={toggling}
              onClick={handleToggle}
            >
              {toToggle?.isActive ? 'Sim, desativar' : 'Sim, reativar'}
            </Button>
          </>
        }
      >
        <p>
          {toToggle?.isActive ? (
            <>
              Tem certeza de que deseja desativar{' '}
              <strong>{toToggle?.name}</strong>? O funcionário perderá o acesso
              ao sistema.
            </>
          ) : (
            <>
              Deseja reativar <strong>{toToggle?.name}</strong>? O funcionário
              voltará a ter acesso ao sistema.
            </>
          )}
        </p>
      </Modal>
    </div>
  );
}
