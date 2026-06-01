import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PetForm from '../../components/admin/PetForm';
import Button from '../../components/ui/Button';
import { PageSpinner } from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { getPetById, createPet, updatePet } from '../../api/petsApi';
import { parseApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';

/**
 * Página de criar/editar pet.
 * - Rota /painel/pets/novo            → modo criação
 * - Rota /painel/pets/:id/editar      → modo edição (carrega o pet primeiro)
 *
 * Após criar, o usuário é direcionado para o gerenciamento de fotos
 * (boa UX: cadastrar pet → subir foto na sequência).
 */
export default function PetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverFieldErrors, setServerFieldErrors] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getPetById(id)
      .then(setPet)
      .catch((err) => setLoadError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setServerError(null);
    setServerFieldErrors(null);

    try {
      if (isEdit) {
        await updatePet(id, payload);
        toast.success('Pet atualizado.');
        navigate('/painel/pets');
      } else {
        const created = await createPet(payload);
        toast.success(`"${created.petName}" cadastrado! Agora adicione fotos.`);
        navigate(`/painel/pets/${created.petId}/fotos`);
      }
    } catch (err) {
      const parsed = parseApiError(err);
      setServerError(parsed.message);
      if (parsed.fieldErrors) setServerFieldErrors(parsed.fieldErrors);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageSpinner />;

  if (loadError) {
    return (
      <div className="admin-content">
        <EmptyState
          icon="🔍"
          title="Pet não encontrado"
          message={loadError.message}
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

      <h1 style={{ marginTop: '0.5rem' }}>
        {isEdit ? `Editar ${pet?.petName}` : 'Cadastrar novo pet'}
      </h1>
      <p className="muted" style={{ marginBottom: '1.5rem' }}>
        {isEdit
          ? 'Atualize as informações do pet.'
          : 'Preencha os dados do animal. Você poderá adicionar fotos no próximo passo.'}
      </p>

      <div className="card" style={{ padding: '1.5rem', maxWidth: 720 }}>
        <PetForm
          initialValues={pet}
          submitting={submitting}
          serverError={serverError}
          serverFieldErrors={serverFieldErrors}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/painel/pets')}
        />
      </div>
    </div>
  );
}
