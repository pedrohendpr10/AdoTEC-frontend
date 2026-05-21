import axios from 'axios';

/**
 * Cliente HTTP central do AdoTEC.
 *
 * - baseURL vem de VITE_API_URL (ver .env); fallback para localhost:8080.
 * - O token JWT é injetado automaticamente em toda requisição.
 * - Respostas 401 disparam o evento global "adotec:unauthorized",
 *   ouvido pelo AuthContext para encerrar a sessão.
 */

export const TOKEN_KEY = 'adotec_jwt';
export const USER_KEY = 'adotec_user';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Injeta o JWT (header Authorization: Bearer ...) em cada requisição.
client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata sessão expirada/inválida de forma global.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('adotec:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export default client;
