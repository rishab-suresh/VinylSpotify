import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';

// Define the shape of a track object based on Spotify's API
export interface Track {
  name: string;
  album: {
    images: { url: string }[];
    name: string;
  };
  artists: { name: string }[];
  uri: string;
  id: string | null;
}

// Define the shape of the player state
interface PlayerState {
  track: Track | null;
  isPaused: boolean;
  isActive: boolean;
  isLoading: boolean;
  deviceId: string | null;
  context: {
    uri: string | null;
    metadata: any;
  } | null;
  queue: Track[];
  // We can add more state here later, like position, duration, etc.
}

// Define the shape of the context, including state and control functions
interface PlayerContextType extends PlayerState {
  player: Spotify.Player | null;
  setPlayer: (player: Spotify.Player | null) => void;
  setDeviceId: (deviceId: string | null) => void;
  updatePlayerState: (state: Spotify.PlaybackState | null) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

// Create the context with a default undefined value
export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Define the props for the provider component
interface PlayerProviderProps {
  children: ReactNode;
}

// Create the provider component
export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const auth = useContext(AuthContext);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    track: null,
    isPaused: true,
    isActive: false,
    isLoading: false,
    deviceId: null,
    context: null,
    queue: [],
  });

  const controlPlayback = useCallback((endpoint: string, method: 'POST' | 'PUT' = 'POST', body?: Record<string, any>) => {
    if (!auth?.accessToken || !playerState.deviceId) return;

    setPlayerState(s => ({ ...s, isLoading: true }));

    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    fetch(`https://api.spotify.com/v1/me/player/${endpoint}?device_id=${playerState.deviceId}`, options)
      .catch(error => console.error("Playback control error:", error));
  }, [auth?.accessToken, playerState.deviceId]);

  const togglePlay = useCallback(() => {
    if (!playerState.track) return; // Can't play if there's no track

    if (!playerState.isPaused) {
      controlPlayback('pause', 'PUT');
    } else {
      const body: { context_uri?: string, uris?: string[] } = {};
      if (playerState.context?.uri) {
        body.context_uri = playerState.context.uri;
      } else if (playerState.track?.uri) {
        body.uris = [playerState.track.uri];
      }
      controlPlayback('play', 'PUT', body);
    }
  }, [playerState.isPaused, playerState.track, playerState.context, controlPlayback]);

  const nextTrack = useCallback(() => {
    controlPlayback('next');
  }, [controlPlayback]);

  const previousTrack = useCallback(() => {
    controlPlayback('previous');
  }, [controlPlayback]);

  const setDeviceId = useCallback((deviceId: string | null) => {
    setPlayerState(s => ({ ...s, deviceId }));
  }, []);

  const updatePlayerState = useCallback((state: Spotify.PlaybackState | null) => {
    if (!state) {
      // Player is not active or has disconnected
      setPlayerState(s => ({ ...s, isActive: false, isLoading: false, track: null, context: null, queue: [] }));
      return;
    }
    setPlayerState(s => ({
      ...s,
      track: state.track_window.current_track,
      isPaused: state.paused,
      isActive: true,
      isLoading: false,
      context: state.context,
      queue: state.track_window.next_tracks,
    }));
  }, []);

  const value = useMemo(() => ({
    ...playerState,
    player,
    setPlayer,
    setDeviceId,
    updatePlayerState,
    togglePlay,
    nextTrack,
    previousTrack,
  }), [playerState, player, setDeviceId, updatePlayerState, togglePlay, nextTrack, previousTrack]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook to use the PlayerContext
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}; 