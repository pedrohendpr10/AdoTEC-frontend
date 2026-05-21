import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PetCard from '../components/pets/PetCard';
import PetFilters from '../components/pets/PetFilters';
import Pagination from '../components/pets/Pagination';
import { PageSpinner } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';
import { usePagedResource } from '../hooks/usePagedResource';
import { getPets } from '../api/petsApi';
import { useDebounced } from '../hooks/useDebounced';

/** Catálogo de pets disponíveis para adoção, com busca e filtro de porte. */
export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('busca') ?? '');
  const [size, setSize] = useState('');

  // A busca por nome é enviada à API; aguardamos o usuário parar de digitar.
  const debouncedSearch = useDebounced(search, 400);

  const params = useMemo(() => ({ name: debouncedSearch }), [debouncedSearch]);
  const { content, pagination, loading, error, setPage } = usePagedResource(
    getPets,
    params,
  );

  // Filtro de porte aplicado no cliente (ver PetFilters / petsApi).
  const visiblePets = size ? content.filter((p) => p.size === size) : content;

  return (
    <div className="page">
      <div className="container">
        <h1>Pets para adoção</h1>
        <p className="muted" style={{ marginBottom: '1.5rem' }}>
          Conheça os animais do Centro de Zoonoses à procura de um lar.
        </p>

        <PetFilters
          search={search}
          onSearch={setSearch}
          size={size}
          onSize={setSize}
        />

        {error && <Alert type="error">{error.message}</Alert>}

        {loading ? (
          <PageSpinner />
        ) : visiblePets.length === 0 ? (
          <EmptyState
            title="Nenhum pet encontrado"
            message="Tente ajustar a busca ou o filtro de porte."
          />
        ) : (
          <>
            <div className="pet-grid">
              {visiblePets.map((pet) => (
                <PetCard key={pet.petId} pet={pet} />
              ))}
            </div>
            {size && (
              <p className="muted text-center" style={{ marginTop: '1rem' }}>
                Filtro de porte aplicado apenas a esta página de resultados.
              </p>
            )}
            <Pagination pagination={pagination} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
