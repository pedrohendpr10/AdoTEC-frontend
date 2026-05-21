import client from './client';

/**
 * Endpoints de agendamentos de visita.
 */

/** POST /appointments → AppointmentResponseDTO (status inicial PENDING) */
export function createAppointment(petId, timeSlotId) {
  return client
    .post('/appointments', { petId, timeSlotId })
    .then((res) => res.data.data);
}

/** GET /appointments/me?page=&size= → { content: [...], pagination } */
export function getMyAppointments({ page = 0, size = 10 } = {}) {
  return client
    .get('/appointments/me', { params: { page, size } })
    .then((res) => res.data.data);
}

/** GET /appointments/{id} → AppointmentResponseDTO */
export function getAppointmentById(id) {
  return client.get(`/appointments/${id}`).then((res) => res.data.data);
}

/** PATCH /appointments/{id}/cancel → AppointmentResponseDTO (status CANCELED) */
export function cancelAppointment(id) {
  return client
    .patch(`/appointments/${id}/cancel`)
    .then((res) => res.data.data);
}
