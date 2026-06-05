import client from './client';

/**
 * Endpoints de pets.
 */

/** GET /pets?name=&petSize=&species=&minAge=&maxAge=&gender=&sort=&page= → { content: [PetResponseDTO], pagination } */
export function getPets({ name, petSize, species, minAge, maxAge, gender, sort, page = 0 } = {}) {
  const params = { page };
  if (name && name.trim()) params.name = name.trim();
  if (petSize) params.petSize = petSize;
  if (species) params.species = species;
  if (minAge != null && minAge !== '') params.minAge = minAge;
  if (maxAge != null && maxAge !== '') params.maxAge = maxAge;
  if (gender) params.gender = gender;
  if (sort) params.sort = sort;
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
