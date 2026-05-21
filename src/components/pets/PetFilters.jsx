import Input from '../ui/Input';
import { PET_SIZES } from '../../utils/format';

/**
 * Filtros do catálogo: busca por nome (enviada à API) e porte do pet.
 *
 * O filtro de porte é aplicado no cliente — o parâmetro `size` da API
 * colide com o `size` da paginação do Spring (ver petsApi.js / documentação).
 */
export default function PetFilters({ search, onSearch, size, onSize }) {
  return (
    <div className="filters">
      <div className="filters__search">
        <Input
          label="Buscar por nome"
          placeholder="Ex.: Rex, Mia..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="field">
        <span className="field__label">Porte</span>
        <div className="chip-group">
          <button
            type="button"
            className={`chip ${!size ? 'chip--active' : ''}`}
            onClick={() => onSize('')}
          >
            Todos
          </button>
          {PET_SIZES.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`chip ${size === s.value ? 'chip--active' : ''}`}
              onClick={() => onSize(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
