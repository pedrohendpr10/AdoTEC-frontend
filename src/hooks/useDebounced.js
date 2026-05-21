import { useState, useEffect } from 'react';

/**
 * Retorna `value` com atraso — útil para campos de busca,
 * evitando uma requisição a cada tecla digitada.
 */
export function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
