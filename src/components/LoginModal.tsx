import React from 'react';
import './LoginModal.css';

const LoginModal: React.FC = () => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Connect to Spotify</h2>
        <p>To start playing your music, you need to connect your Spotify account.</p>
        <a 
          href="http://127.0.0.1:8000/auth/login" 
          className="spotify-login-button"
        >
          Connect with Spotify
        </a>
        <div className="modal-footer">
          <p>This will redirect you to Spotify for authentication.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 