import React, {
  createContext,
  FunctionComponent,
  useContext,
  useState,
} from 'react';
import decode from 'jwt-decode';

import { API_BASE, LOCAL_STORAGE_TOKEN_KEY } from '../constants';

interface TokenPayload {
  id: string;
  admin: boolean;
  iat: number;
  exp: number;
}

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  user: TokenPayload | null;
  login: (email: string, password: string, isRegistration: boolean) => void;
  logout: () => void;
};
export const AuthContext = createContext({} as AuthContextType);
export const useAuth = (): AuthContextType => useContext(AuthContext);

/**
 * Uses React's Context API to provide auth context accross application
 */
const AuthProvider: FunctionComponent = ({ children }) => {
  // SSR safeguard
  const isSSR = typeof window === 'undefined';

  // TODO check token expiration
  const storedToken = isSSR
    ? null
    : localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

  const decodedToken = storedToken
    ? (decode(storedToken) as TokenPayload)
    : null;

  const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken);
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(decodedToken);
  const [loading, setLoading] = useState(false);

  /**
   * Login or register using the credentials provided
   */
  const login = async (
    email: string,
    password: string,
    isRegistration = false,
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}${isRegistration ? '/register' : '/login'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );
      if (response.status >= 300) {
        const message = await response.text();
        throw message;
      }
      const { token } = (await response.json()) as { token: string };
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
      const decodedToken = decode(token) as TokenPayload;
      setToken(token);
      setUser(decodedToken);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      // TODO: handle errors better
      window.alert(error);
      console.error(error);
      setLoading(false);
      return;
    }
  };

  const logout = (): void => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    setToken(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    token,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
