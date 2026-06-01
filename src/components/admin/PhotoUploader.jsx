import { useRef, useState } from 'react';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { uploadPhoto } from '../../api/photosApi';
import { parseApiError } from '../../api/errors';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Componente de upload de foto.
 *
 * Faz validação básica no cliente (tipo e tamanho — o backend é a autoridade),
 * mostra preview e barra de progresso, e dispara onUploaded() ao concluir.
 */
export default function PhotoUploader({ petId, onUploaded, disabled }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handlePick = (selected) => {
    setError(null);
    setProgress(0);

    if (!selected) return;
    if (!ALLOWED.includes(selected.type)) {
      setError('Formato inválido. Use JPEG, PNG ou WebP.');
      return;
    }
    if (selected.size > MAX_BYTES) {
      setError('A imagem ultrapassa 5 MB.');
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadPhoto(petId, file, setProgress);
      reset();
      onUploaded?.();
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="uploader">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handlePick(e.target.files?.[0])}
        style={{ display: 'none' }}
      />

      {!preview ? (
        <button
          type="button"
          className="uploader__drop"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <div className="uploader__icon">📷</div>
          <div className="uploader__title">Adicionar foto</div>
          <div className="uploader__hint">
            JPEG, PNG ou WebP · até 5 MB · máx. 10 fotos
          </div>
        </button>
      ) : (
        <div className="uploader__preview">
          <img src={preview} alt="Pré-visualização" />
          <div className="uploader__preview-actions">
            <Button variant="ghost" onClick={reset} disabled={uploading}>
              Trocar
            </Button>
            <Button
              variant="primary"
              onClick={handleUpload}
              loading={uploading}
            >
              Enviar foto
            </Button>
          </div>
          {uploading && (
            <div className="uploader__progress">
              <div
                className="uploader__progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {error && <Alert type="error">{error}</Alert>}
    </div>
  );
}
