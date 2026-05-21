import Button from '../ui/Button';

/**
 * Controle de paginação que consome o objeto `pagination` (PageMetaDTO)
 * retornado pela API: { number, totalPages, first, last, ... }.
 */
export default function Pagination({ pagination, onChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { number, totalPages, first, last } = pagination;

  return (
    <div className="pagination">
      <Button
        variant="outline"
        size="sm"
        disabled={first}
        onClick={() => onChange(number - 1)}
      >
        ← Anterior
      </Button>
      <span className="pagination__info">
        Página {number + 1} de {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={last}
        onClick={() => onChange(number + 1)}
      >
        Próxima →
      </Button>
    </div>
  );
}
