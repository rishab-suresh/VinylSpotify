// script.js
document.addEventListener('DOMContentLoaded', async () => {
    const loginButton = document.getElementById('login-button');
    const authSection = document.getElementById('auth-section');
    const playerSection = document.getElementById('player-section');
    const playlistList = document.getElementById('playlist-list');

    // ****** USER ACTION REQUIRED ******
    // 1. Go to https://developer.spotify.com/dashboard/ and create an app.
    // 2. Get your Client ID from the app settings.
    // 3. In your Spotify app settings, add this EXACT Redirect URI: http://localhost:8888/callback.html
    // 4. Replace 'YOUR_SPOTIFY_CLIENT_ID' below with your actual Client ID.
    const clientId = 'bdb3433d4df14fa5902a14bb013bfbc6'; 
    // ***********************************

    const redirectUri = 'http://localhost:8888/callback.html';

    loginButton.addEventListener('click', () => {
        if (clientId === 'YOUR_SPOTIFY_CLIENT_ID' || !clientId) {
            alert('Please set your Spotify Client ID in script.js (line 11) first!');
            return;
        }
        initiateLogin(clientId, redirectUri);
    });

    function onLoginSuccess(accessToken) {
        console.log('Logged in successfully!');
        authSection.style.display = 'none';
        playerSection.style.display = 'block';
        document.getElementById('current-track').textContent = 'Logged in! Fetching playlists...';
        fetchUserPlaylists(accessToken);
    }

    async function handleAuthentication() {
        if (clientId === 'YOUR_SPOTIFY_CLIENT_ID' || !clientId) {
            console.warn("Spotify Client ID is not set. Authentication will not proceed.");
            loginButton.textContent = "Configure Client ID in script.js";
            return;
        }

        const storedToken = localStorage.getItem('spotify_access_token');
        const tokenExpiry = localStorage.getItem('spotify_token_expiry');

        if (storedToken && tokenExpiry && new Date().getTime() < parseInt(tokenExpiry)) {
            console.log("Using stored token from localStorage.");
            onLoginSuccess(storedToken);
            return;
        }

        const refreshedToken = await getValidAccessToken(clientId);
        if (refreshedToken) {
            console.log("Token refreshed successfully or was already valid from getValidAccessToken.");
            onLoginSuccess(refreshedToken);
            return;
        }
        
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
            console.error('Authentication error from Spotify callback:', error);
            alert(`Login failed: ${error}. Please try logging in again.`);
            window.history.replaceState({}, document.title, window.location.pathname);
            authSection.style.display = 'block';
            playerSection.style.display = 'none';
            return;
        }

        if (code) {
            try {
                const tokenData = await exchangeCodeForToken(clientId, code, redirectUri);
                if (tokenData.access_token) {
                    const expiresIn = tokenData.expires_in * 1000; 
                    localStorage.setItem('spotify_access_token', tokenData.access_token);
                    localStorage.setItem('spotify_token_expiry', (new Date().getTime() + expiresIn).toString());
                    if (tokenData.refresh_token) {
                        localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
                    }
                    window.history.replaceState({}, document.title, window.location.pathname); 
                    onLoginSuccess(tokenData.access_token);
                } else {
                    console.error('Failed to get access token from exchange', tokenData);
                    alert('Login failed: Could not retrieve access token after redirect.');
                }
            } catch (err) {
                console.error('Error exchanging code for token:', err);
                alert(`Login failed: ${err.message}`);
            }
        }
    }

    async function fetchUserPlaylists(token) {
        playlistList.innerHTML = '<li>Loading playlists...</li>';

        try {
            const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.error('Unauthorized (401) while fetching playlists. Token might be invalid or expired.');
                    localStorage.removeItem('spotify_access_token');
                    localStorage.removeItem('spotify_token_expiry');
                    alert('Your session may have expired. Please log in again or refresh the page.');
                    authSection.style.display = 'block';
                    playerSection.style.display = 'none';
                    window.history.replaceState({}, document.title, window.location.pathname);
                    return;
                }
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            playlistList.innerHTML = ''; 

            if (data.items && data.items.length > 0) {
                data.items.forEach(playlist => {
                    const listItem = document.createElement('li');
                    listItem.textContent = playlist.name;
                    listItem.dataset.playlistId = playlist.id;
                    // TODO: Add event listener to play playlist when Web Playback SDK is integrated
                    // listItem.addEventListener('click', () => playPlaylist(playlist.id, token));
                    playlistList.appendChild(listItem);
                });
            } else {
                playlistList.innerHTML = '<li>No playlists found.</li>';
            }
        } catch (error) {
            console.error('Error fetching playlists:', error);
            playlistList.innerHTML = `<li>Failed to load playlists: ${error.message}</li>`;
        }
    }

    await handleAuthentication();
}); 