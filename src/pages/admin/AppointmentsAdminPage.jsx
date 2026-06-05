import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { getEmployees } from '../../api/employeesApi';
import { useAuth } from '../../context/AuthContext';
import {
  formatDate,
  formatTime,
  appointmentStatus,
} from '../../utils/format';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'CONFIRMED', label: 'Confirmados' },
  { value: 'COMPLETED', label: 'Concluídos' },
  { value: 'CANCELED', label: 'Cancelados' },
];

const SORT_OPTIONS = [
  { value: 'createdAt,DESC', label: 'Mais recentes' },
  { value: 'createdAt,ASC', label: 'Mais antigos' },
  { value: 'appointmentDate,ASC', label: 'Data do agendamento (crescente)' },
  { value: 'appointmentDate,DESC', label: 'Data do agendamento (decrescente)' },
  { value: 'petName,ASC', label: 'Nome do pet (A-Z)' },
  { value: 'petName,DESC', label: 'Nome do pet (Z-A)' },
];

/**
 * Listagem de agendamentos no painel com filtros avançados, ordenação e paginação.
 */
export default function AppointmentsAdminPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filtros vindos da URL
  const statusParam = searchParams.get('status') ?? '';
  const employeeIdParam = searchParams.get('employeeId') ?? '';
  const showCanceledParam = searchParams.get('showCanceled') ?? 'true';
  const sortParam = searchParams.get('sort') ?? 'createdAt,DESC';

  const showCanceled = showCanceledParam === 'true';

  // Estado para controle de qual dropdown está aberto
  const [openDropdown, setOpenDropdown] = useState(null);

  // Lista de funcionários para o Admin
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      getEmployees()
        .then(setEmployees)
        .catch(() => {});
    }
  }, [isAdmin]);

  // Fecha os dropdowns ao clicar em qualquer lugar
  useEffect(() => {
    const handleClose = () => setOpenDropdown(null);
    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, []);

  const toggleDropdown = (name, e) => {
    e.stopPropagation();
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const fetcher = useMemo(
    () => (isAdmin ? getAllAppointments : getMyAppointments),
    [isAdmin],
  );

  // Parâmetros consolidados para a API
  const params = useMemo(() => {
    return {
      status: statusParam || null,
      employeeId: isAdmin && employeeIdParam && employeeIdParam !== 'unassigned' ? employeeIdParam : null,
      unassigned: isAdmin && employeeIdParam === 'unassigned' ? true : null,
      showCanceled,
      sort: sortParam || null,
    };
  }, [statusParam, employeeIdParam, showCanceled, sortParam, isAdmin]);

  const { content, pagination, page, setPage, loading, error } = usePagedResource(
    fetcher,
    params,
  );

  // 1. Sincroniza página da URL com o estado do hook
  const urlPage = useMemo(() => {
    const p = Number(searchParams.get('pagina') ?? '1') - 1;
    return p >= 0 ? p : 0;
  }, [searchParams]);

  useEffect(() => {
    if (page !== urlPage) {
      setPage(urlPage);
    }
  }, [urlPage, page, setPage]);

  // Atualiza a página na URL ao clicar no controle de paginação
  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('pagina', String(newPage + 1));
      return next;
    });
  };


  // Atualização dos filtros na URL
  const handleFilterChange = (newFields) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('pagina', '1'); // Reseta a página para 1 ao filtrar
      Object.entries(newFields).forEach(([key, val]) => {
        if (val === null || val === undefined || val === '') {
          next.delete(key);
        } else {
          next.set(key, String(val));
        }
      });
      return next;
    });
  };

  // Mapeamento dinâmico de funcionários
  const employeeOptions = useMemo(() => {
    return [
      { value: '', label: 'Todos os funcionários' },
      { value: 'unassigned', label: 'Sem funcionário' },
      ...employees.map((emp) => ({
        value: String(emp.id),
        label: emp.name,
      })),
    ];
  }, [employees]);

  // Texto de exibição de range "Mostrando X-Y de Z"
  const start = pagination ? pagination.number * pagination.size + 1 : 0;
  const end = pagination
    ? Math.min((pagination.number + 1) * pagination.size, pagination.totalElements)
    : 0;
  const total = pagination ? pagination.totalElements : 0;

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

      {/* Barra de Filtros */}
      <div className="filters-row">
        {/* Dropdown Status */}
        <div className="filter-dropdown">
          <button
            type="button"
            className="filter-dropdown__trigger"
            onClick={(e) => toggleDropdown('status', e)}
          >
            {STATUS_OPTIONS.find((o) => o.value === statusParam)?.label || 'Status'}
            <span style={{ fontSize: '10px' }}>▼</span>
          </button>
          {openDropdown === 'status' && (
            <div className="filter-dropdown__menu">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`filter-dropdown__item ${
                    statusParam === opt.value ? 'filter-dropdown__item--active' : ''
                  }`}
                  onClick={() => handleFilterChange({ status: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown Funcionário (apenas ADMIN) */}
        {isAdmin && (
          <div className="filter-dropdown">
            <button
              type="button"
              className="filter-dropdown__trigger"
              onClick={(e) => toggleDropdown('employee', e)}
            >
              {employeeOptions.find((o) => o.value === employeeIdParam)?.label || 'Funcionário'}
              <span style={{ fontSize: '10px' }}>▼</span>
            </button>
            {openDropdown === 'employee' && (
              <div className="filter-dropdown__menu">
                {employeeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`filter-dropdown__item ${
                      employeeIdParam === opt.value ? 'filter-dropdown__item--active' : ''
                    }`}
                    onClick={() => handleFilterChange({ employeeId: opt.value })}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dropdown Ordenação */}
        <div className="filter-dropdown">
          <button
            type="button"
            className="filter-dropdown__trigger"
            onClick={(e) => toggleDropdown('sort', e)}
          >
            {SORT_OPTIONS.find((o) => o.value === sortParam)?.label || 'Ordenar por'}
            <span style={{ fontSize: '10px' }}>▼</span>
          </button>
          {openDropdown === 'sort' && (
            <div className="filter-dropdown__menu">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`filter-dropdown__item ${
                    sortParam === opt.value ? 'filter-dropdown__item--active' : ''
                  }`}
                  onClick={() => handleFilterChange({ sort: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Checkbox Mostrar Cancelados */}
        <label className="checkbox-filter">
          <input
            type="checkbox"
            checked={showCanceled}
            onChange={(e) => handleFilterChange({ showCanceled: e.target.checked })}
          />
          Mostrar Cancelados
        </label>
      </div>

      {error && <Alert type="error">{error.message}</Alert>}

      {loading ? (
        <PageSpinner />
      ) : content.length === 0 ? (
        <EmptyState
          icon="📅"
          title="Nenhum agendamento encontrado"
          message={
            statusParam
              ? 'Tente outro filtro.'
              : isAdmin
              ? 'Ainda não há agendamentos no sistema.'
              : 'Você ainda não foi atribuído a nenhuma visita.'
          }
        />
      ) : (
        <>
          {pagination && pagination.totalElements > 0 && (
            <p className="muted" style={{ marginBottom: '1rem', fontSize: 'var(--font-size-sm)' }}>
              Mostrando <strong>{start}–{end}</strong> de <strong>{total}</strong> agendamentos.
            </p>
          )}

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
              {content.map((appt) => {
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
          <Pagination pagination={pagination} onChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
