/**
 * Funções utilitárias de formatação e tradução de enums.
 */

/** "2026-05-20" ou ISO → "20/05/2026" */
export function formatDate(value) {
  if (!value) return '—';
  const datePart = String(value).split('T')[0];
  const [y, m, d] = datePart.split('-');
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
}

/** "09:00:00" → "09:00" */
export function formatTime(value) {
  if (!value) return '—';
  return String(value).slice(0, 5);
}

/** Idade em meses → texto amigável ("2 anos", "5 meses") */
export function formatAge(months) {
  if (months == null) return 'Idade não informada';
  if (months < 1) return 'Recém-nascido';
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'ano' : 'anos'}`;
}

/** PetSize (SMALL | MEDIUM | BIG) → rótulo PT-BR */
export function petSizeLabel(size) {
  return { SMALL: 'Pequeno', MEDIUM: 'Médio', BIG: 'Grande' }[size] ?? size;
}

export const PET_SIZES = [
  { value: 'SMALL', label: 'Pequeno' },
  { value: 'MEDIUM', label: 'Médio' },
  { value: 'BIG', label: 'Grande' },
];

/** PetGender (MALE | FEMALE) → rótulo PT-BR */
export function petGenderLabel(gender) {
  return { MALE: 'Macho', FEMALE: 'Fêmea' }[gender] ?? gender;
}

export const PET_GENDERS = [
  { value: 'MALE', label: 'Macho' },
  { value: 'FEMALE', label: 'Fêmea' },
];

export const PET_SPECIES = [
  { value: 'Cachorro', label: 'Cachorro' },
  { value: 'Gato', label: 'Gato' },
  { value: 'Coelho', label: 'Coelho' },
];

export const AGE_RANGES = [
  { value: '', label: 'Todos' },
  { value: '0-12', label: 'Filhote (0-12 meses)', minAge: 0, maxAge: 12 },
  { value: '13-36', label: 'Jovem (13-36 meses)', minAge: 13, maxAge: 36 },
  { value: '37+', label: 'Adulto (37+ meses)', minAge: 37, maxAge: null },
];

export const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Mais recentes' },
  { value: 'createdAt,asc', label: 'Mais antigos' },
  { value: 'petName,asc', label: 'Nome A-Z' },
  { value: 'petName,desc', label: 'Nome Z-A' },
  { value: 'ageInMonths,asc', label: 'Menor idade' },
  { value: 'ageInMonths,desc', label: 'Maior idade' },
];

/** AppointmentStatus → { label, variant } para exibição com Badge */
export function appointmentStatus(status) {
  const map = {
    PENDING: { label: 'Pendente', variant: 'accent' },
    CONFIRMED: { label: 'Confirmado', variant: 'primary' },
    COMPLETED: { label: 'Concluído', variant: 'success' },
    CANCELED: { label: 'Cancelado', variant: 'danger' },
  };
  return map[status] ?? { label: status, variant: 'neutral' };
}

/** AdoptionResult → rótulo PT-BR */
export function adoptionResultLabel(result) {
  return { APPROVED: 'Aprovada', REJECTED: 'Não aprovada' }[result] ?? null;
}

/** Retorna a URL da foto de capa (primária) de um pet, ou null. */
export function primaryPhotoUrl(pet) {
  const photos = pet?.photos ?? [];
  if (photos.length === 0) return null;
  const primary = photos.find((p) => p.isPrimary) ?? photos[0];
  return primary?.url ?? null;
}

/** Data de hoje no formato yyyy-mm-dd (para inputs <input type="date">). */
export function todayISO() {
  return new Date().toISOString().split('T')[0];
}
