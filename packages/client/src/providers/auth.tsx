import React, {
  createContext,
  FunctionComponent,
  useContext,
  useState,
} from 'react';

import { API_BASE, LOCAL_STORAGE_TOKEN_KEY } from '../constants';

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, isRegistration: boolean) => void;
  logout: () => void;
};
export const AuthContext = createContext({} as AuthContextType);
export const useAuth = (): AuthContextType => useContext(AuthContext);

type AuthProviderProps = {};
const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
  const storedToken =
    // If SSR there is no local storage
    typeof localStorage !== 'undefined' &&
    localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken);
  const [token, setToken] = useState(storedToken);
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
      setToken(token);
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
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
