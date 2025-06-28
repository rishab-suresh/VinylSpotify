import React, { useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

const WebPlayback: React.FC = () => {
  const auth = useContext(AuthContext);
  const { setPlayer, setDeviceId, updatePlayerState } = usePlayer();
  const playerRef = useRef<Spotify.Player | null>(null);

  useEffect(() => {
    if (!auth?.accessToken) {
      return;
    }

    const setupPlayer = () => {
      if (playerRef.current) {
        return;
      }
      
      const player = new window.Spotify.Player({
        name: 'Vinyl Player Web App',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(auth.accessToken as string);
        },
        volume: 0.5
      });

      const onReady = ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      };

      const onNotReady = ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
        setDeviceId(null);
      };

      const onStateChanged = (state: Spotify.PlaybackState | null) => {
        updatePlayerState(state);
      };

      const onAuthError = ({ message }: { message: string }) => {
        console.error('Failed to authenticate', message);
      };

      const onAccountError = ({ message }: { message: string }) => {
        console.error('Account error', message);
      };
      
      player.addListener('ready', onReady);
      player.addListener('not_ready', onNotReady);
      player.addListener('player_state_changed', onStateChanged);
      player.addListener('authentication_error', onAuthError);
      player.addListener('account_error', onAccountError);

      player.connect().then((success: boolean) => {
        if (success) {
          console.log("The Spotify player has connected successfully!");
        }
      });
      
      playerRef.current = player;
      setPlayer(player);
    };

    if (!window.Spotify) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);
      
      window.onSpotifyWebPlaybackSDKReady = setupPlayer;
    } else {
      setupPlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        console.log('Spotify Player disconnected.');
      }
    };
  }, [auth?.accessToken, setPlayer, setDeviceId, updatePlayerState]);

  return null;
};

export default WebPlayback; 