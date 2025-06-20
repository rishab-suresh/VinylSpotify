import React, { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

import VinylPlayer from './components/VinylPlayer';
import Playlist from './components/Playlist';
import LoginModal from './components/LoginModal';
import WebPlayback from './components/WebPlayback';

import './App.css';

const App: React.FC = () => {
  const auth = useContext(AuthContext);
  useTheme();

  useEffect(() => {
    // This effect runs once on mount to handle the auth callback
    if (!auth) return;

    // Check if the URL contains tokens from the auth redirect
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const error = params.get('error');

    if (error) {
      auth.setError(error);
      // Clean the URL
      window.history.replaceState({}, document.title, "/");
    } else if (accessToken && refreshToken) {
      auth.login(accessToken, refreshToken);
      // Clean the URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  if (!auth) {
    return <div>Loading...</div>;
  }

  const { accessToken, status, error } = auth;
  
  if (!accessToken) {
    return <LoginModal />;
  }

  return (
    <div className="main-layout">
      {status === 'failed' && (
        <div className="error-banner">
          <p>Login Failed: {error}</p>
        </div>
      )}
      
      <WebPlayback />
      <div className="player-and-playlist">
        <VinylPlayer />
        <Playlist />
      </div>
    </div>
  );
};

export default App;
