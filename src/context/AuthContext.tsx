import React, { createContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';

// --- Helper Functions for PKCE ---

// Generates a secure random string for the code verifier
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Hashes the code verifier to create the code challenge
const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

// Base64-encodes the hash to get a URL-safe string
const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};


// --- Auth Context ---

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'success' | 'failed';
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

const REDIRECT_URI = `${window.location.origin}/`;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    // Tokens are now read from sessionStorage for better privacy
    accessToken: sessionStorage.getItem('spotify_access_token'),
    refreshToken: sessionStorage.getItem('spotify_refresh_token'),
    status: 'idle',
    error: null,
  });

  const login = useCallback(async () => {
    if (!CLIENT_ID) {
      console.error("Spotify Client ID is not set. Please create a .env file or set it in your Vercel dashboard.");
      setAuthState(s => ({ ...s, status: 'failed', error: 'Spotify Client ID is not configured.'}));
      return;
    }

    const codeVerifier = generateRandomString(64);
    // The verifier also goes into sessionStorage
    sessionStorage.setItem('spotify_pkce_code_verifier', codeVerifier);
    
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative streaming user-read-playback-state user-modify-playback-state user-library-read';
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    
    const params = {
      response_type: 'code',
      client_id: CLIENT_ID,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
    };
    
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  }, []);

  const logout = useCallback(() => {
    setAuthState({ accessToken: null, refreshToken: null, status: 'idle', error: null });
    // Clear sessionStorage
    sessionStorage.removeItem('spotify_access_token');
    sessionStorage.removeItem('spotify_refresh_token');
    sessionStorage.removeItem('spotify_pkce_code_verifier');
    window.location.href = '/';
  }, []);

  const getAccessToken = useCallback(async (code?: string): Promise<string | null> => {
    // If we're already fetching a token, don't do it again.
    if (authState.status === 'loading') {
      return null;
    }
    
    if (!code) {
      console.log("No code provided for token exchange.");
      return null;
    }

    const codeVerifier = sessionStorage.getItem('spotify_pkce_code_verifier');
    if (!CLIENT_ID || !codeVerifier) {
      console.error("Client ID or code verifier is missing.");
      return null;
    }
    
    try {
      setAuthState(s => ({...s, status: 'loading'}));
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      
      const data = await response.json();
      // Store tokens in sessionStorage
      sessionStorage.setItem('spotify_access_token', data.access_token);
      sessionStorage.setItem('spotify_refresh_token', data.refresh_token);
      sessionStorage.removeItem('spotify_pkce_code_verifier'); // Clean up

      setAuthState({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        status: 'success',
        error: null,
      });
      
      return data.access_token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      setAuthState(s => ({...s, status: 'failed', error: 'Failed to fetch token.'}));
      return null;
    }
  }, [authState.status]);

  // This effect runs on mount to handle the redirect from Spotify
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    // If we have a code and we don't have a token yet, fetch it.
    if (code && !authState.accessToken) {
      getAccessToken(code);
      // Clean the URL
      window.history.replaceState({}, document.title, "/");
    }
  }, [authState.accessToken, getAccessToken]);

  const value = useMemo(() => ({
    ...authState,
    login,
    logout,
    getAccessToken,
  }), [authState, login, logout, getAccessToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 