/**
 * Etiqueta colorida.
 * variant: 'primary' | 'accent' | 'success' | 'danger' | 'neutral'
 */
export default function Badge({ variant = 'neutral', children }) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}
