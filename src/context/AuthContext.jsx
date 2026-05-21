import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { TOKEN_KEY, USER_KEY } from '../api/client';
import * as authApi from '../api/authApi';

/**
 * Contexto de autenticação.
 *
 * Guarda o usuário logado e o JWT. As "roles" vêm da resposta de login
 * (o token só carrega o e-mail), por isso o usuário é persistido inteiro
 * no sessionStorage junto com o token.
 */

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(false);

  const persist = useCallback((data) => {
    // data = { id, name, email, roles, jwtToken }
    const { jwtToken, ...userData } = data;
    sessionStorage.setItem(TOKEN_KEY, jwtToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const data = await authApi.login(email, password);
        persist(data);
        return data;
      } finally {
        setLoading(false);
      }
    },
    [persist],
  );

  const register = useCallback(
    async (name, email, password) => {
      setLoading(true);
      try {
        const data = await authApi.register(name, email, password);
        persist(data); // o backend já autentica no cadastro
        return data;
      } finally {
        setLoading(false);
      }
    },
    [persist],
  );

  // Encerra a sessão quando o cliente HTTP detecta um 401.
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('adotec:unauthorized', handler);
    return () => window.removeEventListener('adotec:unauthorized', handler);
  }, [logout]);

  const roles = user?.roles ?? [];
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    roles,
    hasRole: (role) => roles.includes(role),
    isAdopter: roles.includes('ROLE_ADOPTER'),
    isEmployee: roles.includes('ROLE_EMPLOYEE'),
    isAdmin: roles.includes('ROLE_ADMIN'),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
