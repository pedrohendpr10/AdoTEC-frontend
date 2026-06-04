import client from './client';

/**
 * Endpoints relacionados a funcionários do Centro (ADMIN only).
 */

/** GET /employees → [UserResponse] */
export function getEmployees() {
  return client.get('/employees').then((res) => res.data.data);
}

/** GET /employees/{id} → UserResponse */
export function getEmployeeById(id) {
  return client.get(`/employees/${id}`).then((res) => res.data.data);
}

/** POST /employees → UserResponse */
export function createEmployee(data) {
  return client.post('/employees', data).then((res) => res.data.data);
}

/** PUT /employees/{id} → UserResponse */
export function updateEmployee(id, data) {
  return client.put(`/employees/${id}`, data).then((res) => res.data.data);
}

/** PATCH /employees/{id}/toggle-active → UserResponse */
export function toggleEmployeeActive(id) {
  return client
    .patch(`/employees/${id}/toggle-active`)
    .then((res) => res.data.data);
}
