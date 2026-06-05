import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { petSizeLabel, formatAge, primaryPhotoUrl, petGenderLabel } from '../../utils/format';

/** Cartão de pet exibido no catálogo e na home. */
export default function PetCard({ pet }) {
  const photo = primaryPhotoUrl(pet);

  return (
    <article className="card pet-card">
      <div className="pet-card__media">
        {photo ? (
          <img
            className="pet-card__img"
            src={photo}
            alt={`Foto de ${pet.petName}`}
            loading="lazy"
          />
        ) : (
          <span className="pet-card__placeholder" aria-hidden="true">
            🐶
          </span>
        )}
        <div className="pet-card__size">
          <Badge variant="primary">{petSizeLabel(pet.size)}</Badge>
        </div>
      </div>

      <div className="pet-card__body">
        <h3 className="pet-card__name">{pet.petName}</h3>
        <p className="pet-card__meta">
          {pet.species} · {petGenderLabel(pet.gender)} · {formatAge(pet.ageInMonths)}
        </p>
        <div className="pet-card__footer">
          <Link to={`/pets/${pet.petId}`}>
            <Button variant="primary" size="sm" block>
              Conhecer
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
