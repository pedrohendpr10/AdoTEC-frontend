/**
 * Botão padronizado do AdoTEC.
 *
 * Props:
 *  - variant: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger'
 *  - size:    'sm' | 'md' | 'lg'
 *  - block:   ocupa 100% da largura
 *  - loading: exibe spinner e desabilita o botão
 */
import Spinner from './Spinner';

export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size !== 'md' && `btn--${size}`,
    block && 'btn--block',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner small />}
      {children}
    </button>
  );
}
