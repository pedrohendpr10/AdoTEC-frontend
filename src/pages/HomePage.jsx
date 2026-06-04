import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import PetCard from '../components/pets/PetCard';
import HeroSection from '../components/layout/HeroSection';
import { PageSpinner } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { getDestaquePets } from '../api/petsApi';
import { useAuth } from '../context/AuthContext';

/** Página inicial: hero, como funciona e uma prévia de pets. */
export default function HomePage() {
  const { isAuthenticated, isEmployee, isAdmin } = useAuth();
  const isStaff = isEmployee || isAdmin;
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDestaquePets()
      .then((data) => setPets(data ?? []))
      .catch(() => setPets([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ===== Hero ===== */}
      <HeroSection
        heroImage="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600"
        title={<>Encontre o seu novo <em>melhor amigo</em></>}
        subtitle="O AdoTEC conecta você aos animais do Centro de Zoonoses que estão à espera de um lar. Conheça, agende uma visita e mude duas vidas."
        primaryLabel={isStaff ? 'Acessar painel' : 'Quero adotar 🐾'}
        primaryTo={isStaff ? '/painel' : '/pets'}
        secondaryLabel={!isAuthenticated ? 'Criar conta' : null}
      />

      {/* ===== Como funciona (apenas para adotantes/visitantes) ===== */}
      {!isStaff && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Como funciona</h2>
            <p className="section-subtitle">Adotar é simples e leva poucos passos</p>
            <div className="steps">
              <div className="card step">
                <div className="step__num">1</div>
                <h3 className="step__title">Escolha</h3>
                <p className="muted">
                  Navegue pelo catálogo e conheça os animais disponíveis para
                  adoção.
                </p>
              </div>
              <div className="card step">
                <div className="step__num">2</div>
                <h3 className="step__title">Agende</h3>
                <p className="muted">
                  Marque uma visita em um dos horários disponíveis para conhecer o
                  pet pessoalmente.
                </p>
              </div>
              <div className="card step">
                <div className="step__num">3</div>
                <h3 className="step__title">Adote</h3>
                <p className="muted">
                  Compareça à visita e, se for um match, leve seu novo amigo para
                  casa.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== Prévia de pets ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-title">Esperando por um lar</h2>
          <p className="section-subtitle">Alguns dos amigos disponíveis agora</p>

          {loading ? (
            <PageSpinner />
          ) : pets.length === 0 ? (
            <EmptyState
              title="Nenhum pet disponível no momento"
              message="Volte em breve — novos animais são cadastrados com frequência."
            />
          ) : (
            <div className="pet-grid">
              {pets.map((pet) => (
                <PetCard key={pet.petId} pet={pet} />
              ))}
            </div>
          )}

          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/pets">
              <Button variant="primary" size="lg">
                Ver todos os pets
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
