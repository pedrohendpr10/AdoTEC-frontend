import { useState, useEffect, useCallback } from 'react';
import { parseApiError } from '../api/errors';

/**
 * Hook genérico para consumir endpoints paginados do AdoTEC.
 *
 * O `fetcher` recebe `{ page, ...params }` e deve devolver o objeto
 * `data` da API, no formato { content: [...], pagination: {...} }.
 *
 * @example
 *   const { content, pagination, page, setPage, loading, error, reload } =
 *     usePagedResource(getPets, { name: busca });
 */
export function usePagedResource(fetcher, params = {}) {
  const [page, setPage] = useState(0);
  const [content, setContent] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Serializa os params para usar como dependência estável do efeito.
  const paramsKey = JSON.stringify(params);

  // Volta para a primeira página sempre que os filtros mudam.
  useEffect(() => {
    setPage(0);
  }, [paramsKey]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher({ page, ...JSON.parse(paramsKey) });
      setContent(data.content ?? []);
      setPagination(data.pagination ?? null);
    } catch (err) {
      setError(parseApiError(err));
      setContent([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, paramsKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { content, pagination, page, setPage, loading, error, reload: load };
}
