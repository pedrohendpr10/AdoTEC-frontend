import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import './HeroSection.css';

/**
 * Hero section editorial com foto full-bleed e overlay em gradiente.
 *
 * @param {string}  heroImage      — URL da imagem de fundo
 * @param {string}  title          — Título principal (pode conter <em>)
 * @param {string}  subtitle       — Texto de apoio abaixo do título
 * @param {string}  primaryLabel   — Label do botão primário (CTA)
 * @param {string}  secondaryLabel — Label do botão secundário
 * @param {string}  primaryTo      — Rota do botão primário (default: /pets)
 * @param {string}  secondaryTo    — Rota do botão secundário (default: /cadastro)
 */
export default function HeroSection({
  heroImage = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600',
  title,
  subtitle,
  primaryLabel = 'Quero adotar 🐾',
  secondaryLabel = 'Criar conta',
  primaryTo = '/pets',
  secondaryTo = '/cadastro',
}) {
  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url('${heroImage}')` }}
    >
      {/* Overlay: gradiente mais escuro à esquerda, transparente à direita */}
      <div className="hero-section__overlay" aria-hidden="true" />

      {/* Conteúdo */}
      <div className="hero-section__content">
        <h1 className="hero-section__title">{title}</h1>
        <p className="hero-section__subtitle">{subtitle}</p>

        <div className="hero-section__actions">
          <Link to={primaryTo}>
            <Button variant="accent" size="lg">
              {primaryLabel}
            </Button>
          </Link>
          <Link to={secondaryTo}>
            <Button
              variant="outline"
              size="lg"
              className="hero-section__btn-secondary"
            >
              {secondaryLabel}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
