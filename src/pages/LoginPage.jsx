import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { parseApiError } from '../api/errors';

/** Página de login. Trata também o rate limit (HTTP 429) do backend. */
export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Rota para onde voltar após autenticar (definida por ProtectedRoute).
  const fromOrigin = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState(0); // timestamp (ms)

  const isBlocked = Date.now() < blockedUntil;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await login(form.email, form.password);
      toast.success('Bem-vindo(a) de volta!');

      // Sem rota de origem: staff vai pro painel; adotantes pra home.
      const roles = data?.roles ?? [];
      const isStaff =
        roles.includes('ROLE_ADMIN') || roles.includes('ROLE_EMPLOYEE');
      const target = fromOrigin ?? (isStaff ? '/painel' : '/');
      navigate(target, { replace: true });
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.status === 429) {
        // Rate limit excedido — bloqueia o botão pelo tempo informado.
        const seconds = parsed.retryAfter ?? 60;
        setBlockedUntil(Date.now() + seconds * 1000);
        setError(`${parsed.message}`);
      } else {
        setError(parsed.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1 className="auth-card__title">Entrar</h1>
        <p className="auth-card__subtitle">Acesse sua conta no AdoTEC</p>

        <form className="stack" onSubmit={handleSubmit}>
          {error && <Alert type="error">{error}</Alert>}

          <Input
            label="E-mail"
            type="email"
            name="email"
            placeholder="voce@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Senha"
            type="password"
            name="password"
            placeholder="Sua senha"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            block
            loading={submitting}
            disabled={isBlocked}
          >
            {isBlocked ? 'Aguarde um instante...' : 'Entrar'}
          </Button>
        </form>

        <p className="auth-card__footer">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
