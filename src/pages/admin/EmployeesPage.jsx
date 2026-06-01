import { useEffect, useState } from 'react';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import { PageSpinner } from '../../components/ui/Spinner';
import { getEmployees } from '../../api/employeesApi';
import { parseApiError } from '../../api/errors';

/**
 * Lista de funcionários do Centro (apenas ADMIN).
 * Usada principalmente como referência para atribuição em agendamentos.
 *
 * Nota: o backend atual não expõe endpoints de criação/edição de funcionários
 * (contas só são criadas pelo DevDataSeeder em ambiente dev). Quando o backend
 * adicionar essas rotas, esta página é o lugar natural para incluí-las.
 */
export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getEmployees()
      .then(setEmployees)
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-content">
      <header className="admin-content__header">
        <div>
          <h1>Funcionários</h1>
          <p className="muted">
            Usuários com permissão para acompanhar visitas e gerenciar pets.
          </p>
        </div>
      </header>

      {error && <Alert type="error">{error.message}</Alert>}

      {loading ? (
        <PageSpinner />
      ) : employees.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Nenhum funcionário cadastrado"
          message="Os funcionários precisam ser criados diretamente no backend."
        />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <strong>{emp.name}</strong>
                </td>
                <td>{emp.email}</td>
                <td>
                  <span className="muted">#{emp.id}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
