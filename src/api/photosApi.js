import client from './client';

/**
 * Endpoints de fotos de pets — backend integra com Cloudinary.
 *
 * Regras do servidor:
 *  - tipos aceitos: JPEG, PNG, WebP
 *  - tamanho máximo: 5 MB
 *  - até 10 fotos por pet
 *  - a 1ª foto vira capa automaticamente
 */

/**
 * POST /pets/{petId}/photos (multipart) → PetPhotoResponseDTO
 *
 * @param onProgress callback opcional (recebe 0..100)
 */
export function uploadPhoto(petId, file, onProgress) {
  const form = new FormData();
  form.append('file', file);

  return client
    .post(`/pets/${petId}/photos`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    })
    .then((res) => res.data.data);
}

/** GET /pets/{petId}/photos → [PetPhotoResponseDTO] (público) */
export function listPhotos(petId) {
  return client.get(`/pets/${petId}/photos`).then((res) => res.data.data);
}

/** DELETE /pets/{petId}/photos/{photoId} → 200 (corpo nulo) */
export function deletePhoto(petId, photoId) {
  return client
    .delete(`/pets/${petId}/photos/${photoId}`)
    .then(() => null);
}

/** PATCH /pets/{petId}/photos/{photoId}/primary → PetPhotoResponseDTO */
export function setPrimaryPhoto(petId, photoId) {
  return client
    .patch(`/pets/${petId}/photos/${photoId}/primary`)
    .then((res) => res.data.data);
}
