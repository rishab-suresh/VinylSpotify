import React, { useContext, useEffect, useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { AuthContext } from './context/AuthContext';
import VinylPlayer from './components/VinylPlayer';
import Playlist from './components/Playlist';
import LoginModal from './components/LoginModal';
import ClientIdForm from './components/ClientIdForm';
import WebPlayback from './components/WebPlayback';
import './App.css';

const App: React.FC = () => {
  const { theme } = useTheme();
  const auth = useContext(AuthContext);
  const [clientId, setClientId] = useState<string | null>(() => localStorage.getItem('spotify_client_id'));

  const handleSaveClientId = (id: string) => {
    localStorage.setItem('spotify_client_id', id);
    setClientId(id);
    // We might need to re-initialize the auth context or reload
    window.location.reload();
  };

  // This effect is now handled by the AuthProvider, we just need to ensure it runs
  useEffect(() => {
    // The AuthProvider will handle the redirect and token exchange.
    // This effect is here to ensure App component re-renders if auth state changes.
  }, [auth?.accessToken]);


  if (!clientId) {
    return <ClientIdForm onSave={handleSaveClientId} />;
  }

  return (
    <div className={`App ${theme}`}>
      {!auth?.accessToken ? (
        <LoginModal />
      ) : (
        <>
          <WebPlayback />
          <main className="player-layout">
            <VinylPlayer />
            <Playlist />
          </main>
        </>
      )}
    </div>
  );
};

export default App;
