import client from './client';

/**
 * Endpoints de pets.
 *
 * NOTA DE CONTRATO: o backend aceita um filtro `size` (PetSize), mas o nome
 * colide com o `size` de paginação do Spring. Por isso NÃO enviamos o filtro
 * de porte na query — ele é aplicado no cliente (ver CatalogPage).
 */

/** GET /pets?name=&page= → { content: [PetResponseDTO], pagination } */
export function getPets({ name, page = 0 } = {}) {
  const params = { page };
  if (name && name.trim()) params.name = name.trim();
  return client.get('/pets', { params }).then((res) => res.data.data);
}

/** GET /pets/{id} → PetResponseDTO (404 se inativo/indisponível) */
export function getPetById(id) {
  return client.get(`/pets/${id}`).then((res) => res.data.data);
}

/** GET /pets/{petId}/photos → [PetPhotoResponseDTO] */
export function getPetPhotos(petId) {
  return client.get(`/pets/${petId}/photos`).then((res) => res.data.data);
}
