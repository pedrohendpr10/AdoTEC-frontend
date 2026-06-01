import client from './client';

/**
 * Endpoints relacionados a funcionários do Centro.
 * Atualmente o backend só expõe a listagem (ADMIN only).
 */

/** GET /employees → [UserResponse] (ADMIN only) */
export function getEmployees() {
  return client.get('/employees').then((res) => res.data.data);
}
