import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PetCard from '../components/pets/PetCard';
import CatalogSidebar from '../components/pets/CatalogSidebar';
import SortSelect from '../components/pets/SortSelect';
import Pagination from '../components/pets/Pagination';
import { PageSpinner } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';
import { usePagedResource } from '../hooks/usePagedResource';
import { getPets } from '../api/petsApi';
import { useDebounced } from '../hooks/useDebounced';
import { AGE_RANGES } from '../utils/format';

/** Catálogo de pets disponíveis para adoção, com filtros avançados e ordenação. */
export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filtros vindos da URL (ou valores padrão)
  const nameParam = searchParams.get('busca') ?? '';
  const petSize = searchParams.get('porte') ?? '';
  const species = searchParams.get('especie') ?? '';
  const gender = searchParams.get('sexo') ?? '';
  const ageRange = searchParams.get('idade') ?? '';
  const sort = searchParams.get('ordenacao') ?? 'createdAt,desc';

  // Input de busca com estado local (para digitar fluidamente)
  const [search, setSearch] = useState(nameParam);

  // Sincroniza busca local se a URL mudar externamente (ex. ao limpar filtros)
  useEffect(() => {
    setSearch(nameParam);
  }, [nameParam]);

  const debouncedSearch = useDebounced(search, 400);

  // Mapeamento da faixa de idade
  const parsedAge = useMemo(() => {
    const range = AGE_RANGES.find((r) => r.value === ageRange);
    return {
      minAge: range?.minAge ?? null,
      maxAge: range?.maxAge ?? null,
    };
  }, [ageRange]);

  // Parâmetros consolidados para a API
  const params = useMemo(() => {
    return {
      name: debouncedSearch,
      petSize: petSize || null,
      species: species || null,
      gender: gender || null,
      minAge: parsedAge.minAge,
      maxAge: parsedAge.maxAge,
      sort: sort || null,
    };
  }, [debouncedSearch, petSize, species, gender, parsedAge, sort]);

  const { content, pagination, page, setPage, loading, error } = usePagedResource(
    getPets,
    params
  );

  // 1. Sincroniza a página da URL com o estado interno do hook
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


  // Manipuladores de Filtros (atualizam a URL)
  const handleFilterChange = (newFields) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(newFields).forEach(([key, val]) => {
        const urlKey = {
          name: 'busca',
          petSize: 'porte',
          species: 'especie',
          gender: 'sexo',
          ageRange: 'idade',
          sort: 'ordenacao',
        }[key] || key;

        if (val) {
          next.set(urlKey, val);
        } else {
          next.delete(urlKey);
        }
      });
      next.set('pagina', '1'); // Reseta para a primeira página ao alterar filtros
      return next;
    });
  };

  const handleSortChange = (newSort) => {
    handleFilterChange({ sort: newSort });
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
    setSearch('');
  };

  return (
    <div className="page">
      <div className="container">
        <h1>Pets para adoção</h1>
        <p className="muted" style={{ marginBottom: '2rem' }}>
          Conheça os animais do Centro de Zoonoses à procura de um lar.
        </p>

        {error && <Alert type="error">{error.message}</Alert>}

        <div className="catalog-layout">
          {/* Painel de Filtros */}
          <CatalogSidebar
            filters={{ name: search, petSize, species, gender, ageRange }}
            onChangeFilters={handleFilterChange}
            onClearAll={handleClearAll}
          />

          {/* Conteúdo Principal */}
          <main className="catalog-main">
            <SortSelect
              value={sort}
              onChange={handleSortChange}
              totalElements={pagination?.totalElements ?? 0}
            />

            {loading ? (
              <div style={{ padding: '4rem 0' }}>
                <PageSpinner />
              </div>
            ) : content.length === 0 ? (
              <EmptyState
                title="Nenhum pet encontrado"
                message="Tente ajustar a busca ou os filtros na barra lateral."
              />
            ) : (
              <>
                <div className="pet-grid">
                  {content.map((pet) => (
                    <PetCard key={pet.petId} pet={pet} />
                  ))}
                </div>
                <Pagination pagination={pagination} onChange={handlePageChange} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
