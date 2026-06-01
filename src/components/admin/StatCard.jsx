/**
 * Cartão de métrica usado no Dashboard.
 * Props: label, value, icon, accent (cor do número — variante visual)
 */
export default function StatCard({ label, value, icon, accent = 'primary' }) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}
