import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { parseApiError } from '../api/errors';

/** Página de cadastro de adotante. O backend já autentica após o registro. */
export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /** Validação básica no cliente (o backend é a autoridade final). */
  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 3)
      errs.name = 'Informe ao menos 3 caracteres.';
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = 'Informe um e-mail válido.';
    if (form.password.length < 6)
      errs.password = 'A senha deve ter ao menos 6 caracteres.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      toast.success('Conta criada com sucesso! Bem-vindo(a) ao AdoTEC.');
      navigate('/pets', { replace: true });
    } catch (err) {
      const parsed = parseApiError(err);
      // Erros de validação campo a campo vindos do backend.
      if (parsed.fieldErrors) setFieldErrors(parsed.fieldErrors);
      setError(parsed.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1 className="auth-card__title">Criar conta</h1>
        <p className="auth-card__subtitle">
          Cadastre-se para adotar e agendar visitas
        </p>

        <form className="stack" onSubmit={handleSubmit} noValidate>
          {error && <Alert type="error">{error}</Alert>}

          <Input
            label="Nome completo"
            name="name"
            placeholder="Seu nome"
            value={form.name}
            onChange={handleChange}
            error={fieldErrors.name}
          />
          <Input
            label="E-mail"
            type="email"
            name="email"
            placeholder="voce@email.com"
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
          />
          <Input
            label="Senha"
            type="password"
            name="password"
            placeholder="Mínimo de 6 caracteres"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            hint="Use ao menos 6 caracteres."
          />

          <Button type="submit" variant="primary" block loading={submitting}>
            Criar minha conta
          </Button>
        </form>

        <p className="auth-card__footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
