import React, { createContext, useState, useEffect, useMemo, type FC, type ReactNode } from 'react';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setError: (error: string) => void;
  authStarted: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: localStorage.getItem('spotify_access_token'),
    refreshToken: localStorage.getItem('spotify_refresh_token'),
    status: localStorage.getItem('spotify_access_token') ? 'succeeded' : 'idle',
    error: null,
  });

  const authStarted = () => {
    setAuthState(s => ({ ...s, status: 'loading' }));
  };
  
  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('spotify_access_token', accessToken);
    localStorage.setItem('spotify_refresh_token', refreshToken);
    setAuthState({ accessToken, refreshToken, status: 'succeeded', error: null });
  };

  const logout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    setAuthState({ accessToken: null, refreshToken: null, status: 'idle', error: null });
  };
  
  const setError = (error: string) => {
    setAuthState(s => ({ ...s, status: 'failed', error }));
  };

  const value = useMemo(() => ({
    ...authState,
    login,
    logout,
    setError,
    authStarted
  }), [authState]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 