import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faBackward, faForward } from '@fortawesome/free-solid-svg-icons';
import './VinylPlayer.css';
import { usePlayer } from '../context/PlayerContext';
import ThemeSwitcher from './ThemeSwitcher';

const VinylPlayer: React.FC = () => {
  const { theme } = useTheme();
  const { 
    track, 
    isPaused, 
    deviceId,
    isLoading,
    togglePlay,
    nextTrack,
    previousTrack
  } = usePlayer();
  const player = usePlayer().player;
  const [localVolume, setLocalVolume] = useState(1);

  const albumArtUrl = track?.album.images[0]?.url;
  const recordStyle = {
    backgroundColor: 'var(--record-bg)',
    backgroundImage: albumArtUrl ? `url(${albumArtUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const isPlaying = !isPaused && !!deviceId;

  // Effect to sync local volume with player volume
  useEffect(() => {
    const getVolume = async () => {
      if (player) {
        const volume = await player.getVolume();
        setLocalVolume(volume);
      }
    };
    getVolume();

    // The player object might be recreated, so we depend on it
  }, [player]);

  const handlePowerClick = () => {
    togglePlay();
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    if (player) {
      player.setVolume(volume);
    }
  };

  return (
    <div className="vinyl-player-container">
      <div className="turntable-base">
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

        <div className="volume-knob-area">
          <div className="volume-knob" style={{ transform: `rotate(${localVolume * 270 - 135}deg)` }}>
            <div className="knob-marker"></div>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.5"
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
        <div className="speed-control">33</div>
      </div>
    </div>
  );
};

export default VinylPlayer; 