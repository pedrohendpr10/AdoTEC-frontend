/** Indicador de carregamento. `small` para uso embutido (ex.: dentro de botões). */
export default function Spinner({ small = false }) {
  return <span className={small ? 'spinner spinner--sm' : 'spinner'} role="status" aria-label="Carregando" />;
}

/** Spinner centralizado, para estados de carregamento de página/seção. */
export function PageSpinner() {
  return (
    <div className="spinner-wrap">
      <Spinner />
    </div>
  );
}
