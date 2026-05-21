/**
 * Campo de formulário com rótulo, mensagem de erro e dica.
 * Funciona para <input> e (com as="textarea") para áreas de texto.
 */
export default function Input({
  label,
  error,
  hint,
  as = 'input',
  className = '',
  id,
  ...rest
}) {
  const Control = as;
  const fieldId = id || rest.name;

  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <Control
        id={fieldId}
        className={`field__control ${error ? 'field__control--error' : ''} ${className}`}
        {...rest}
      />
      {error && <span className="field__error">{error}</span>}
      {hint && !error && <span className="field__hint">{hint}</span>}
    </div>
  );
}
