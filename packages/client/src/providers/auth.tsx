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

type AuthProviderProps = {};
const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
  // If SSR there is no window
  const isSSR = typeof window === 'undefined';

  // TODO check token expiration
  const storedToken = isSSR
    ? null
    : localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

  const decodedToken = storedToken
    ? (decode(storedToken) as {
        user: TokenPayload;
        iat: number;
        exp: number;
      })
    : null;

  const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken);
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(decodedToken ? decodedToken.user : null);
  const [loading, setLoading] = useState(false);

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
          }), // body data type must match "Content-Type" header
        },
      );
      const { token } = (await response.json()) as { token: string };
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
      const decodedToken = decode(token) as {
        user: TokenPayload;
        iat: number;
        exp: number;
      };
      setToken(token);
      setUser(decodedToken.user);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      // TODO: handle errors
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
