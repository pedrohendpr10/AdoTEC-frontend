/** Estado vazio — exibido quando uma lista não tem resultados. */
export default function EmptyState({ icon = '🐾', title, message, children }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      {title && <h3 className="empty-state__title">{title}</h3>}
      {message && <p>{message}</p>}
      {children && <div style={{ marginTop: '1rem' }}>{children}</div>}
    </div>
  );
}
