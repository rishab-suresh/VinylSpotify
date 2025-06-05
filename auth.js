// auth.js

// Function to generate a random string for code_verifier
function generateCodeVerifier() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let text = '';
    for (let i = 0; i < 128; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Function to generate code_challenge from code_verifier
async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function initiateLogin(clientId, redirectUri) {
    const codeVerifier = generateCodeVerifier();
    localStorage.setItem('pkce_code_verifier', codeVerifier); // Store for token exchange
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative streaming user-read-playback-state user-modify-playback-state user-library-read';
    
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    const params = {
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
    };
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

async function exchangeCodeForToken(clientId, code, redirectUri) {
    const codeVerifier = localStorage.getItem('pkce_code_verifier');
    if (!codeVerifier) {
        throw new Error("Code verifier not found in local storage.");
    }

    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    };

    try {
        const response = await fetch(tokenUrl, payload);
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error exchanging token:", errorData);
            throw new Error(`Token exchange failed: ${response.status} ${response.statusText} - ${errorData.error_description || errorData.error}`);
        }
        const data = await response.json();
        localStorage.removeItem('pkce_code_verifier'); // Clean up
        return data;
    } catch (error) {
        console.error("Fetch error during token exchange:", error);
        localStorage.removeItem('pkce_code_verifier'); // Clean up
        throw error;
    }
}

// Function to refresh access token (if refresh_token is available)
async function refreshAccessToken(clientId) {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    if (!refreshToken) {
        console.log("No refresh token available.");
        return null;
    }

    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId
        }),
    };

    try {
        const response = await fetch(tokenUrl, payload);
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error refreshing token:", errorData);
            if (response.status === 400 && (errorData.error === 'invalid_grant' || errorData.error === 'invalid_refresh_token')) {
                localStorage.removeItem('spotify_refresh_token');
                localStorage.removeItem('spotify_access_token');
                localStorage.removeItem('spotify_token_expiry');
            }
            throw new Error(`Token refresh failed: ${response.status} ${response.statusText} - ${errorData.error_description || errorData.error}`);
        }
        const data = await response.json();
        
        if (data.refresh_token) {
            localStorage.setItem('spotify_refresh_token', data.refresh_token);
        }
        const expiresIn = data.expires_in * 1000;
        localStorage.setItem('spotify_access_token', data.access_token);
        localStorage.setItem('spotify_token_expiry', (new Date().getTime() + expiresIn).toString());

        console.log("Access token refreshed successfully.");
        return data.access_token;
    } catch (error) {
        console.error("Fetch error during token refresh:", error);
        throw error;
    }
}

async function getValidAccessToken(clientId) {
    let accessToken = localStorage.getItem('spotify_access_token');
    const tokenExpiry = localStorage.getItem('spotify_token_expiry');

    if (accessToken && tokenExpiry && new Date().getTime() < parseInt(tokenExpiry)) {
        return accessToken;
    }

    try {
        accessToken = await refreshAccessToken(clientId);
        if (accessToken) {
            return accessToken;
        }
    } catch (error) {
        console.warn("Could not refresh token:", error.message);
    }
    
    console.log("Need to log in again.");
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    return null;
} 