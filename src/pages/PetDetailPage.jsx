import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { PageSpinner } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ScheduleModal from '../components/pets/ScheduleModal';
import { getPetById } from '../api/petsApi';
import { parseApiError } from '../api/errors';
import { petSizeLabel, formatAge, petGenderLabel } from '../utils/format';
import { useAuth } from '../context/AuthContext';

/** Página de detalhe de um pet, com galeria de fotos e agendamento de visita. */
export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdopter } = useAuth();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPetById(id)
      .then((data) => {
        setPet(data);
        // Coloca a foto primária em primeiro lugar.
        const photos = data.photos ?? [];
        const primaryIdx = photos.findIndex((p) => p.isPrimary);
        setActivePhoto(primaryIdx > 0 ? primaryIdx : 0);
      })
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleScheduleClick = () => {
    if (!isAuthenticated) {
      // Sem login: manda autenticar e volta para esta página.
      navigate('/login', { state: { from: { pathname: `/pets/${id}` } } });
      return;
    }
    // Proteção: funcionários não podem abrir o modal de agendamento.
    if (!isAdopter) return;
    setScheduleOpen(true);
  };

  if (loading) return <PageSpinner />;

  if (error) {
    return (
      <div className="page container">
        <EmptyState
          icon="🔍"
          title={error.status === 404 ? 'Pet não encontrado' : 'Algo deu errado'}
          message={
            error.status === 404
              ? 'Este pet não está mais disponível para adoção.'
              : error.message
          }
        >
          <Link to="/pets">
            <Button variant="primary">Voltar ao catálogo</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  const photos = pet.photos ?? [];
  const current = photos[activePhoto];

  return (
    <div className="page">
      <div className="container">
        <Link to="/pets" className="muted">
          ← Voltar ao catálogo
        </Link>

        <div className="pet-detail" style={{ marginTop: '1rem' }}>
          {/* Galeria */}
          <div>
            <div className="gallery__main">
              {current ? (
                <img src={current.url} alt={`Foto de ${pet.petName}`} />
              ) : (
                <span className="gallery__placeholder" aria-hidden="true">
                  🐶
                </span>
              )}
            </div>
            {photos.length > 1 && (
              <div className="gallery__thumbs">
                {photos.map((photo, idx) => (
                  <button
                    key={photo.photoId}
                    className={`gallery__thumb ${
                      idx === activePhoto ? 'gallery__thumb--active' : ''
                    }`}
                    onClick={() => setActivePhoto(idx)}
                  >
                    <img src={photo.url} alt={`Miniatura ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="pet-detail__info">
            <div className="row" style={{ marginBottom: '0.5rem' }}>
              <Badge variant="primary">{petSizeLabel(pet.size)}</Badge>
              {pet.isAvailableForAdoption && (
                <Badge variant="success">Disponível</Badge>
              )}
            </div>

            <h1>{pet.petName}</h1>
            <p className="muted">{pet.species}</p>

            <ul className="info-list">
              <li>
                <span>Espécie</span>
                <span>{pet.species}</span>
              </li>
              <li>
                <span>Porte</span>
                <span>{petSizeLabel(pet.size)}</span>
              </li>
              <li>
                <span>Sexo</span>
                <span>{petGenderLabel(pet.gender)}</span>
              </li>
              <li>
                <span>Idade</span>
                <span>{formatAge(pet.ageInMonths)}</span>
              </li>
            </ul>

            {pet.description && (
              <>
                <h3>Sobre {pet.petName}</h3>
                <p style={{ marginTop: '0.5rem' }}>{pet.description}</p>
              </>
            )}

            <div style={{ marginTop: '1.5rem' }}>
              {isAuthenticated && !isAdopter ? (
                <Alert type="info">
                  Sua conta não é de adotante — o agendamento de visitas é
                  exclusivo para adotantes.
                </Alert>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  block
                  onClick={handleScheduleClick}
                >
                  Agendar visita 🐾
                </Button>
              )}
              {!isAuthenticated && (
                <p className="field__hint" style={{ marginTop: '0.5rem' }}>
                  Você precisará entrar na sua conta para agendar.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        pet={pet}
        onScheduled={() => {
          setScheduleOpen(false);
          navigate('/meus-agendamentos');
        }}
      />
    </div>
  );
}
