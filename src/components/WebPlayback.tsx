import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

const WebPlayback: React.FC = () => {
  const auth = useContext(AuthContext);
  const { setPlayer, setDeviceId, updatePlayerState } = usePlayer();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      if (!auth?.accessToken) return;

      const player = new window.Spotify.Player({
        name: 'Vinyl Player Web App',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(auth.accessToken as string);
        },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setDeviceId(null);
      });

      player.addListener('player_state_changed', (state) => {
        // state can be null here if the player becomes inactive
        updatePlayerState(state);
      });

      player.addListener('authentication_error', ({ message }) => {
          console.error('Failed to authenticate', message);
      });

      player.addListener('account_error', ({ message }) => {
          console.error('Account error', message);
      });

      player.connect().then((success: boolean) => {
          if (success) {
              console.log("The Spotify player has connected successfully!");
          }
      });
    };

    return () => {
      // Here you might want to disconnect the player, but it depends on the desired UX
    }
  }, [auth, setPlayer, setDeviceId, updatePlayerState]);

  return null;
};

export default WebPlayback; 