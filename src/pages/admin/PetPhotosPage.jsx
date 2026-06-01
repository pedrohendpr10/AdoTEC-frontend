import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { PageSpinner } from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import PhotoUploader from '../../components/admin/PhotoUploader';
import { getPetById } from '../../api/petsApi';
import {
  listPhotos,
  deletePhoto,
  setPrimaryPhoto,
} from '../../api/photosApi';
import { parseApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';

/** Gerencia as fotos de um pet: upload, definir capa e remover. */
export default function PetPhotosPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [pet, setPet] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadPhotos = () =>
    listPhotos(id).then(setPhotos).catch(() => setPhotos([]));

  useEffect(() => {
    setLoading(true);
    Promise.all([getPetById(id).then(setPet), loadPhotos()])
      .catch(() => setPet(null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSetPrimary = async (photo) => {
    setBusy(true);
    try {
      await setPrimaryPhoto(id, photo.photoId);
      toast.success('Foto de capa atualizada.');
      await loadPhotos();
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setBusy(true);
    try {
      await deletePhoto(id, toDelete.photoId);
      toast.success('Foto removida.');
      setToDelete(null);
      await loadPhotos();
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <PageSpinner />;

  if (!pet) {
    return (
      <div className="admin-content">
        <EmptyState
          icon="🔍"
          title="Pet não encontrado"
          message="Este pet não está mais disponível."
        >
          <Link to="/painel/pets">
            <Button variant="primary">Voltar à lista</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <Link to="/painel/pets" className="muted">
        ← Voltar à lista
      </Link>

      <header className="admin-content__header" style={{ marginTop: '0.5rem' }}>
        <div>
          <h1>Fotos de {pet.petName}</h1>
          <p className="muted">
            A primeira foto vira a capa automaticamente. Você pode mudar a qualquer
            momento.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/painel/pets/${id}/editar`)}
        >
          Editar dados do pet
        </Button>
      </header>

      {photos.length === 0 ? (
        <div className="card" style={{ padding: '1.5rem' }}>
          <p className="muted" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Este pet ainda não tem fotos. Comece adicionando uma:
          </p>
          <PhotoUploader petId={id} onUploaded={loadPhotos} />
        </div>
      ) : (
        <>
          <div className="photo-grid">
            {photos.map((photo) => (
              <div className="photo-card" key={photo.photoId}>
                <div className="photo-card__media">
                  <img src={photo.url} alt={`Foto de ${pet.petName}`} />
                  {photo.isPrimary && (
                    <div className="photo-card__badge">
                      <Badge variant="accent">Capa</Badge>
                    </div>
                  )}
                </div>
                <div className="photo-card__actions">
                  {!photo.isPrimary && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => handleSetPrimary(photo)}
                    >
                      Definir como capa
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={busy}
                    onClick={() => setToDelete(photo)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Adicionar nova foto</h3>
            <PhotoUploader
              petId={id}
              onUploaded={loadPhotos}
              disabled={photos.length >= 10}
            />
            {photos.length >= 10 && (
              <p className="muted" style={{ marginTop: '0.5rem' }}>
                Limite de 10 fotos por pet atingido. Remova alguma antes de
                adicionar outra.
              </p>
            )}
          </div>
        </>
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Remover foto"
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" loading={busy} onClick={handleDelete}>
              Remover
            </Button>
          </>
        }
      >
        <p>Tem certeza de que deseja remover esta foto?</p>
      </Modal>
    </div>
  );
}
