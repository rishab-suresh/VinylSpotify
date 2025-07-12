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
    // If we have an access token, we don't need to do anything.
    if (auth?.accessToken) {
      return;
    }

    // This effect runs on mount to check for an access token in the URL.
    const hash = window.location.hash;
    window.location.hash = ""; // Clear the hash from the URL
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      
      if (accessToken) {
        auth?.login(accessToken, refreshToken || '');
      }
    }
  }, [auth]);

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
