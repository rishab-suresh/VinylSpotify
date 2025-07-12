import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './LoginModal.css';

const LoginModal: React.FC = () => {
  const auth = useContext(AuthContext);

  const handleLogin = () => {
    auth?.login();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Connect to Spotify</h2>
        <p>To start playing your music, you need to connect your Spotify account.</p>
        <button 
          onClick={handleLogin}
          className="spotify-login-button"
        >
          Connect with Spotify
        </button>
        <div className="modal-footer">
          <p>This will redirect you to Spotify for authentication.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 