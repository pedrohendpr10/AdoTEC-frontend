import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { PET_SIZES, PET_GENDERS, PET_SPECIES, AGE_RANGES } from '../../utils/format';

/**
 * Sidebar de filtros para a página de catálogo.
 * Apresenta acordeões expansíveis (apenas um aberto por vez), campo de busca
 * e botão para limpar todos os filtros. Possui comportamento responsivo para mobile.
 */
export default function CatalogSidebar({ filters, onChangeFilters, onClearAll }) {
  const [openSection, setOpenSection] = useState('porte'); // 'porte' aberto por padrão
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  const handleSearchChange = (e) => {
    onChangeFilters({ name: e.target.value });
  };

  const selectFilter = (key, value) => {
    onChangeFilters({ [key]: value });
  };

  return (
    <>
      {/* Botão de Toggle para Mobile */}
      <div className="mobile-filter-bar">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-filter-bar__toggle"
        >
          {mobileOpen ? 'Fechar Filtros ✕' : 'Filtrar & Ordenar 🔍'}
        </Button>
      </div>

      <aside className={`catalog-sidebar ${mobileOpen ? 'catalog-sidebar--open' : ''}`}>
        <div className="catalog-sidebar__header">
          <h3>Filtros</h3>
          {Object.values(filters).some(v => v !== '' && v != null) && (
            <button type="button" className="catalog-sidebar__clear-link" onClick={onClearAll}>
              Limpar tudo
            </button>
          )}
        </div>

        <div className="catalog-sidebar__body">
          {/* Campo de Busca por Nome */}
          <div className="catalog-sidebar__search">
            <Input
              label="Buscar por nome"
              id="catalog-search"
              placeholder="Ex.: Rex, Luna..."
              value={filters.name || ''}
              onChange={handleSearchChange}
            />
          </div>

          {/* Accordion: Porte */}
          <div className="accordion">
            <button
              type="button"
              className="accordion__header"
              onClick={() => toggleSection('porte')}
              aria-expanded={openSection === 'porte'}
            >
              <span>Porte</span>
              <span className="accordion__icon">{openSection === 'porte' ? '−' : '+'}</span>
            </button>
            <div className={`accordion__body ${openSection === 'porte' ? 'accordion__body--open' : ''}`}>
              <div className="accordion__content">
                <button
                  type="button"
                  className={`accordion__option ${!filters.petSize ? 'accordion__option--active' : ''}`}
                  onClick={() => selectFilter('petSize', '')}
                >
                  Todos
                </button>
                {PET_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    className={`accordion__option ${filters.petSize === size.value ? 'accordion__option--active' : ''}`}
                    onClick={() => selectFilter('petSize', size.value)}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accordion: Espécie */}
          <div className="accordion">
            <button
              type="button"
              className="accordion__header"
              onClick={() => toggleSection('especie')}
              aria-expanded={openSection === 'especie'}
            >
              <span>Espécie</span>
              <span className="accordion__icon">{openSection === 'especie' ? '−' : '+'}</span>
            </button>
            <div className={`accordion__body ${openSection === 'especie' ? 'accordion__body--open' : ''}`}>
              <div className="accordion__content">
                <button
                  type="button"
                  className={`accordion__option ${!filters.species ? 'accordion__option--active' : ''}`}
                  onClick={() => selectFilter('species', '')}
                >
                  Todos
                </button>
                {PET_SPECIES.map((specie) => (
                  <button
                    key={specie.value}
                    type="button"
                    className={`accordion__option ${filters.species === specie.value ? 'accordion__option--active' : ''}`}
                    onClick={() => selectFilter('species', specie.value)}
                  >
                    {specie.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accordion: Sexo */}
          <div className="accordion">
            <button
              type="button"
              className="accordion__header"
              onClick={() => toggleSection('sexo')}
              aria-expanded={openSection === 'sexo'}
            >
              <span>Sexo</span>
              <span className="accordion__icon">{openSection === 'sexo' ? '−' : '+'}</span>
            </button>
            <div className={`accordion__body ${openSection === 'sexo' ? 'accordion__body--open' : ''}`}>
              <div className="accordion__content">
                <button
                  type="button"
                  className={`accordion__option ${!filters.gender ? 'accordion__option--active' : ''}`}
                  onClick={() => selectFilter('gender', '')}
                >
                  Todos
                </button>
                {PET_GENDERS.map((gender) => (
                  <button
                    key={gender.value}
                    type="button"
                    className={`accordion__option ${filters.gender === gender.value ? 'accordion__option--active' : ''}`}
                    onClick={() => selectFilter('gender', gender.value)}
                  >
                    {gender.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accordion: Idade */}
          <div className="accordion">
            <button
              type="button"
              className="accordion__header"
              onClick={() => toggleSection('idade')}
              aria-expanded={openSection === 'idade'}
            >
              <span>Idade</span>
              <span className="accordion__icon">{openSection === 'idade' ? '−' : '+'}</span>
            </button>
            <div className={`accordion__body ${openSection === 'idade' ? 'accordion__body--open' : ''}`}>
              <div className="accordion__content">
                {AGE_RANGES.map((range) => (
                  <button
                    key={range.value}
                    type="button"
                    className={`accordion__option ${filters.ageRange === range.value ? 'accordion__option--active' : ''}`}
                    onClick={() => selectFilter('ageRange', range.value)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botão limpar mobile-visible ou geral */}
        <div className="catalog-sidebar__footer">
          <Button variant="outline" block onClick={onClearAll}>
            Limpar Filtros
          </Button>
        </div>
      </aside>
    </>
  );
}
