/** Rodapé do site. */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <div className="footer__brand">
            Ado<span className="navbar__brand-accent">TEC</span>
          </div>
          <p className="footer__note">
            Sistema de Adoção do Centro de Zoonoses
          </p>
        </div>
        <p className="footer__note">
          © {new Date().getFullYear()} AdoTEC · Projeto acadêmico
        </p>
      </div>
    </footer>
  );
}
