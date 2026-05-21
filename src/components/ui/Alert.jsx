/**
 * Mensagem de destaque (inline) para erros, sucessos e avisos.
 * type: 'error' | 'success' | 'warning' | 'info'
 */
const ICONS = {
  error: '⚠️',
  success: '✅',
  warning: '⚡',
  info: 'ℹ️',
};

export default function Alert({ type = 'info', children }) {
  if (!children) return null;
  return (
    <div className={`alert alert--${type}`} role="alert">
      <span aria-hidden="true">{ICONS[type]}</span>
      <span>{children}</span>
    </div>
  );
}
