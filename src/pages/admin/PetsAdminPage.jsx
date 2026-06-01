import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import { PageSpinner } from '../../components/ui/Spinner';
import Pagination from '../../components/pets/Pagination';
import { usePagedResource } from '../../hooks/usePagedResource';
import { useDebounced } from '../../hooks/useDebounced';
import { getPets, deletePet } from '../../api/petsApi';
import { parseApiError } from '../../api/errors';
import {
  petSizeLabel,
  formatAge,
  primaryPhotoUrl,
} from '../../utils/format';
import { useToast } from '../../context/ToastContext';

/**
 * Listagem administrativa de pets, com busca, paginação e ações por linha.
 * O backend só expõe pets disponíveis (não há endpoint de "todos incluindo
 * inativos" no momento).
 */
export default function PetsAdminPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search, 400);
  const params = useMemo(() => ({ name: debouncedSearch }), [debouncedSearch]);

  const { content, pagination, loading, error, setPage, reload } =
    usePagedResource(getPets, params);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deletePet(toDelete.petId);
      toast.success(`Pet "${toDelete.petName}" removido.`);
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-content">
      <header className="admin-content__header">
        <div>
          <h1>Pets</h1>
          <p className="muted">
            Cadastre, edite e gerencie as fotos dos animais disponíveis.
          </p>
        </div>
        <Link to="/painel/pets/novo">
          <Button variant="primary">+ Novo pet</Button>
        </Link>
      </header>

      <Input
        label="Buscar"
        placeholder="Filtrar por nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ height: '1rem' }} />

      {error && <Alert type="error">{error.message}</Alert>}

      {loading ? (
        <PageSpinner />
      ) : content.length === 0 ? (
        <EmptyState
          title="Nenhum pet cadastrado"
          message="Comece cadastrando o primeiro pet do Centro."
        >
          <Link to="/painel/pets/novo">
            <Button variant="primary">+ Novo pet</Button>
          </Link>
        </EmptyState>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 64 }}></th>
                <th>Nome</th>
                <th>Espécie</th>
                <th>Porte</th>
                <th>Idade</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {content.map((pet) => {
                const photo = primaryPhotoUrl(pet);
                return (
                  <tr key={pet.petId}>
                    <td>
                      <div className="data-table__thumb">
                        {photo ? (
                          <img src={photo} alt="" />
                        ) : (
                          <span aria-hidden="true">🐶</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{pet.petName}</strong>
                    </td>
                    <td>{pet.species}</td>
                    <td>{petSizeLabel(pet.size)}</td>
                    <td>{formatAge(pet.ageInMonths)}</td>
                    <td>
                      {pet.isAvailableForAdoption ? (
                        <Badge variant="success">Disponível</Badge>
                      ) : (
                        <Badge variant="neutral">Adotado</Badge>
                      )}
                    </td>
                    <td>
                      <div className="data-table__actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/painel/pets/${pet.petId}/fotos`)
                          }
                        >
                          Fotos
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/painel/pets/${pet.petId}/editar`)
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setToDelete(pet)}
                        >
                          Excluir
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

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Excluir pet"
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Sim, excluir
            </Button>
          </>
        }
      >
        <p>
          Tem certeza de que deseja excluir <strong>{toDelete?.petName}</strong>?
          O pet será removido das listagens públicas, mas o histórico de
          agendamentos será preservado.
        </p>
      </Modal>
    </div>
  );
}
