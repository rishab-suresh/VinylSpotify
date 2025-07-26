import React, { useContext, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { AuthContext } from './context/AuthContext';
import VinylPlayer from './components/VinylPlayer';
import Playlist from './components/Playlist';
import LoginModal from './components/LoginModal';
import WebPlayback from './components/WebPlayback';
import './App.css';

const App: React.FC = () => {
  const { theme } = useTheme();
  const auth = useContext(AuthContext);

  useEffect(() => {
  }, [auth?.accessToken]);

  if (auth?.status === 'loading') {
    return (
      <div className={`App ${theme}`}>
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      </div>
    );
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
