import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faBackward, faForward, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './VinylPlayer.css';
import { usePlayer } from '../context/PlayerContext';
import ThemeSwitcher from './ThemeSwitcher';

const VinylPlayer: React.FC = () => {
  const auth = useContext(AuthContext);
  const { 
    track, 
    isPaused, 
    deviceId,
    isLoading,
    volume,
    setVolume,
    togglePlay,
    nextTrack,
    previousTrack
  } = usePlayer();

  const handleLogout = () => {
    auth?.logout();
  };

  const albumArtUrl = track?.album.images[0]?.url;
  const recordStyle = {
    backgroundColor: 'var(--record-bg)',
    backgroundImage: albumArtUrl ? `url(${albumArtUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const isPlaying = !isPaused && !!deviceId;

  const handlePowerClick = () => {
    togglePlay();
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="vinyl-player-container">
      <div className="turntable-base">
        <div className="author" onClick={() => window.open("https://portfolio-kappa-gilt-97.vercel.app/", "_blank") }>Rishab Suresh</div>
        <ThemeSwitcher />
        <div className="platter">
          <div className={`record ${isPlaying ? 'playing' : ''}`}>
            <div className={`record-label ${isLoading ? 'loading' : ''}`} style={recordStyle}>
              <div className="spindle-hole"></div>
            </div>
            <div className="spindle"></div>
          </div>
        </div>

        <div className={`tonearm ${isPlaying ? 'playing' : ''}`}>
          <div className="headshell">
          </div>
        </div>

        <div className="volume-slider-area">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            className="volume-slider"
            onChange={handleVolumeChange}
            disabled={!deviceId}
          />
        </div>

        <div className="player-controls-group">
          <button 
            className="control-button" 
            onClick={() => previousTrack()} 
            disabled={!deviceId}
            aria-label="Previous Track"
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button 
            className="control-button play-pause-button" 
            onClick={handlePowerClick} 
            disabled={!deviceId}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
          </button>
          <button 
            className="control-button" 
            onClick={() => nextTrack()} 
            disabled={!deviceId}
            aria-label="Next Track"
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>
        <div className={`power-light ${isPlaying ? 'on' : ''}`}></div>
      </div>

      <div className="app-actions-container">
        <button onClick={handleLogout} className="app-action-button" title="Logout">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(VinylPlayer); 