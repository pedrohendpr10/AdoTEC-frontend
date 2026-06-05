import { SORT_OPTIONS } from '../../utils/format';

/**
 * Barra de ordenação e contador de resultados.
 * Apresenta o número de pets encontrados e um seletor estilizado para alterar a ordenação.
 */
export default function SortSelect({ value, onChange, totalElements = 0 }) {
  return (
    <div className="sort-bar">
      <div className="sort-bar__count">
        <strong>{totalElements}</strong> {totalElements === 1 ? 'pet encontrado' : 'pets encontrados'}
      </div>
      <div className="sort-bar__control">
        <label htmlFor="sort-select" className="sort-bar__label">
          Ordenar por:
        </label>
        <select
          id="sort-select"
          className="sort-bar__select"
          value={value || 'createdAt,desc'}
          onChange={(e) => onChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
