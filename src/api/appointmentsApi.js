import client from './client';

/**
 * Endpoints de agendamentos de visita.
 */

/**
 * POST /appointments → AppointmentResponseDTO (status inicial PENDING).
 *
 * @param petId      ID numérico do pet
 * @param timeSlotId String no formato "YYYY-MM-DD_HH:MM" (vem do GET /timeslots)
 */
export function createAppointment(petId, timeSlotId) {
  return client
    .post('/appointments', { petId, timeSlotId })
    .then((res) => res.data.data);
}

/** GET /appointments/me?page=&size= → { content, pagination }
 *   ADOPTER  → agendamentos onde é o adotante
 *   EMPLOYEE → agendamentos onde está atribuído
 */
export function getMyAppointments({ status, showCanceled, sort, page = 0, size = 10 } = {}) {
  const params = { page, size };
  if (status) params.status = status;
  if (showCanceled !== undefined) params.showCanceled = showCanceled;
  if (sort) params.sort = sort;
  return client
    .get('/appointments/me', { params })
    .then((res) => res.data.data);
}

/** GET /appointments?page=&size= → { content, pagination }  (apenas ADMIN) */
export function getAllAppointments({ status, employeeId, unassigned, showCanceled, sort, page = 0, size = 10 } = {}) {
  const params = { page, size };
  if (status) params.status = status;
  if (employeeId) params.employeeId = employeeId;
  if (unassigned) params.unassigned = unassigned;
  if (showCanceled !== undefined) params.showCanceled = showCanceled;
  if (sort) params.sort = sort;
  return client
    .get('/appointments', { params })
    .then((res) => res.data.data);
}

/** GET /dashboard/unassigned-appointments?page=&size= → { content, pagination } (apenas ADMIN) */
export function getUnassignedAppointments({ page = 0, size = 5 } = {}) {
  return client
    .get('/dashboard/unassigned-appointments', { params: { page, size } })
    .then((res) => res.data.data);
}

/** GET /appointments/{id} → AppointmentResponseDTO  (com checagem de ownership no backend) */
export function getAppointmentById(id) {
  return client.get(`/appointments/${id}`).then((res) => res.data.data);
}

/** PATCH /appointments/{id}/cancel → AppointmentResponseDTO (apenas o adopter dono) */
export function cancelAppointment(id) {
  return client
    .patch(`/appointments/${id}/cancel`)
    .then((res) => res.data.data);
}

/** PATCH /appointments/{id}/assign/{employeeId}  (apenas ADMIN) */
export function assignEmployee(appointmentId, employeeId) {
  return client
    .patch(`/appointments/${appointmentId}/assign/${employeeId}`)
    .then((res) => res.data.data);
}

/** PATCH /appointments/{id}/result  (ADMIN ou EMPLOYEE)
 *  body: { result: 'APPROVED' | 'REJECTED', notes?: string }
 */
export function registerResult(appointmentId, result, notes) {
  return client
    .patch(`/appointments/${appointmentId}/result`, { result, notes })
    .then((res) => res.data.data);
}
