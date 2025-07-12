import React, { useState } from 'react';
import './ClientIdForm.css';

interface ClientIdFormProps {
  onSave: (clientId: string) => void;
}

const ClientIdForm: React.FC<ClientIdFormProps> = ({ onSave }) => {
  const [clientId, setClientId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientId.trim()) {
      onSave(clientId.trim());
    }
  };

  return (
    <div className="client-id-form-container">
      <div className="client-id-form-box">
        <h2>Enter Spotify Client ID</h2>
        <p>
          To use this app, you need to provide your own Spotify Client ID from the{' '}
          <a href="https://developer.spotify.com/dashboard/" target="_blank" rel="noopener noreferrer">
            Spotify Developer Dashboard
          </a>.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter your Spotify Client ID"
            className="client-id-input"
            required
          />
          <button type="submit" className="save-button">
            Save and Continue
          </button>
        </form>
        <p className="privacy-note">
          Your Client ID is saved only in your browser's local storage.
        </p>
      </div>
    </div>
  );
};

export default ClientIdForm; 