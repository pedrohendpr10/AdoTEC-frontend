import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { PET_SIZES } from '../../utils/format';

/**
 * Formulário reutilizável para criar/editar pet.
 *
 * Props:
 *  - initialValues: pet existente (para edição), opcional
 *  - onSubmit(payload): chamado com os dados validados
 *  - onCancel: chamado ao clicar em Cancelar
 *  - submitting: bool, controla o estado de loading do botão
 *  - serverError: string opcional para exibir erro vindo do backend
 *  - serverFieldErrors: { campo → mensagem } opcional
 */
export default function PetForm({
  initialValues,
  onSubmit,
  onCancel,
  submitting,
  serverError,
  serverFieldErrors,
}) {
  const [form, setForm] = useState({
    petName: '',
    species: '',
    description: '',
    ageInMonths: '',
    size: 'MEDIUM',
  });
  const [errors, setErrors] = useState({});

  // Preenche o formulário em modo edição
  useEffect(() => {
    if (initialValues) {
      setForm({
        petName: initialValues.petName ?? '',
        species: initialValues.species ?? '',
        description: initialValues.description ?? '',
        ageInMonths:
          initialValues.ageInMonths != null
            ? String(initialValues.ageInMonths)
            : '',
        size: initialValues.size ?? 'MEDIUM',
      });
    }
  }, [initialValues]);

  // Aplica erros vindos do servidor (Bean Validation)
  useEffect(() => {
    if (serverFieldErrors) setErrors(serverFieldErrors);
  }, [serverFieldErrors]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.petName.trim()) errs.petName = 'O nome é obrigatório.';
    if (!form.species.trim()) errs.species = 'A espécie é obrigatória.';
    if (!form.size) errs.size = 'Selecione um porte.';
    if (form.ageInMonths !== '' && Number.isNaN(Number(form.ageInMonths))) {
      errs.ageInMonths = 'Idade deve ser um número.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      petName: form.petName.trim(),
      species: form.species.trim(),
      description: form.description.trim() || null,
      ageInMonths:
        form.ageInMonths === '' ? null : Number(form.ageInMonths),
      size: form.size,
    };
    onSubmit(payload);
  };

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      {serverError && <Alert type="error">{serverError}</Alert>}

      <Input
        label="Nome do pet *"
        name="petName"
        placeholder="Ex.: Rex"
        value={form.petName}
        onChange={handleChange}
        error={errors.petName}
      />

      <Input
        label="Espécie *"
        name="species"
        placeholder="Ex.: Cão, Gato, Coelho..."
        value={form.species}
        onChange={handleChange}
        error={errors.species}
      />

      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div className="field">
            <label className="field__label" htmlFor="size">
              Porte *
            </label>
            <select
              id="size"
              name="size"
              className={`field__control ${errors.size ? 'field__control--error' : ''}`}
              value={form.size}
              onChange={handleChange}
            >
              {PET_SIZES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.size && <span className="field__error">{errors.size}</span>}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Input
            label="Idade (em meses)"
            name="ageInMonths"
            type="number"
            min="0"
            placeholder="Ex.: 24"
            value={form.ageInMonths}
            onChange={handleChange}
            error={errors.ageInMonths}
            hint="Opcional"
          />
        </div>
      </div>

      <Input
        label="Descrição"
        name="description"
        as="textarea"
        rows="4"
        placeholder="Conte um pouco sobre o temperamento, história..."
        value={form.description}
        onChange={handleChange}
        hint="Opcional"
      />

      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {initialValues ? 'Salvar alterações' : 'Cadastrar pet'}
        </Button>
      </div>
    </form>
  );
}
