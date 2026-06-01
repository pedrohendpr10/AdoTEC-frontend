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

/** GET /pets/destaque → [PetResponseDTO] (top 4, cacheado no Redis) */
export function getDestaquePets() {
  return client.get('/pets/destaque').then((res) => res.data.data);
}

/** GET /pets/{id} → PetResponseDTO (404 se inativo/indisponível) */
export function getPetById(id) {
  return client.get(`/pets/${id}`).then((res) => res.data.data);
}

/** GET /pets/{petId}/photos → [PetPhotoResponseDTO] */
export function getPetPhotos(petId) {
  return client.get(`/pets/${petId}/photos`).then((res) => res.data.data);
}

/** POST /pets → PetResponseDTO (ADMIN ou EMPLOYEE) */
export function createPet(payload) {
  return client.post('/pets', payload).then((res) => res.data.data);
}

/** PUT /pets/{id} → PetResponseDTO (ADMIN ou EMPLOYEE) */
export function updatePet(id, payload) {
  return client.put(`/pets/${id}`, payload).then((res) => res.data.data);
}

/** DELETE /pets/{id} → 204 (ADMIN ou EMPLOYEE) — soft-delete */
export function deletePet(id) {
  return client.delete(`/pets/${id}`).then(() => null);
}
