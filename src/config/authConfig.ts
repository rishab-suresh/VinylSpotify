// src/config/authConfig.ts

export const authConfig = {
  clientId: 'bdb3433d4df14fa5902a14bb013bfbc6', // Your Spotify Client ID
  
  // IMPORTANT: Replace this with the URL of your Vercel deployment.
  // This is the URL you configured in the Spotify Developer Dashboard.
  redirectUri: 'https://vinyl-spotify.vercel.app/', 
  
  // The local URI your Vercel app will redirect back to.
  localRedirectUri: 'http://localhost:5173/callback',

  // Spotify API endpoints
  authorizationUrl: 'https://accounts.spotify.com/authorize',
  tokenUrl: 'https://accounts.spotify.com/api/token',
  
  // Scopes for the permissions we need
  scope: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative streaming user-read-playback-state user-modify-playback-state user-library-read',
}; 