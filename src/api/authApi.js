import client from './client';

/**
 * Endpoints de autenticação.
 * Todas as funções retornam diretamente o conteúdo de `data` da ApiResponse.
 */

/** POST /auth/login → { id, name, email, roles[], jwtToken } */
export function login(email, password) {
  return client
    .post('/auth/login', { email, password })
    .then((res) => res.data.data);
}

/** POST /auth/register → { id, name, email, roles[], jwtToken } (cria e já autentica) */
export function register(name, email, password) {
  return client
    .post('/auth/register', { name, email, password })
    .then((res) => res.data.data);
}

/** GET /auth/me → { id, name, email } (não retorna roles) */
export function getMe() {
  return client.get('/auth/me').then((res) => res.data.data);
}
