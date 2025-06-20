import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import './Playlist.css';

const Playlist: React.FC = () => {
  const { track: currentTrack, queue } = usePlayer();

  const allTracks = currentTrack ? [currentTrack, ...queue] : queue;

  if (allTracks.length === 0) {
    return (
      <div className="playlist-container">
        <h2>Queue</h2>
        <p className="empty-queue-message">Play something on Spotify to see your queue.</p>
      </div>
    );
  }

  return (
    <div className="playlist-container">
      <h2>Queue</h2>
      <ul className="playlist">
        {allTracks.map((track, index) => (
          <li
            key={`${track.uri}-${index}`}
            className={`playlist-item ${index === 0 ? 'active' : ''}`}
          >
            <img src={track.album.images[2]?.url || ''} alt={track.album.name} className="track-album-art" />
            <div className="track-info">
              <span className="track-name">{track.name}</span>
              <span className="track-artist">{track.artists.map(a => a.name).join(', ')}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist; 