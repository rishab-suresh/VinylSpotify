import os
import secrets
import string
from urllib.parse import urlencode
import httpx
from base64 import b64encode

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# --- Configuration ---
CLIENT_ID = os.getenv("VITE_SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("VITE_SPOTIFY_CLIENT_SECRET")
# The redirect URI for the FastAPI server itself
REDIRECT_URI = "http://127.0.0.1:8000/auth/callback"
# The URI of the React frontend to redirect back to
FRONTEND_URI = "http://127.0.0.1:3001"
# The key for storing the state in a cookie
STATE_KEY = "spotify_auth_state"

# --- FastAPI App Initialization ---
app = FastAPI()

# Allow requests from the frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URI, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Authentication Routes ---

@app.get("/auth/login")
def login():
    """
    Redirects the user to the Spotify authorization page.
    A random 'state' string is created and stored in a cookie to prevent CSRF.
    """
    state = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))
    scope = "user-library-read user-read-private user-read-email playlist-read-private user-modify-playback-state user-read-playback-state streaming"
    
    auth_params = {
        'response_type': 'code',
        'client_id': CLIENT_ID,
        'scope': scope,
        'redirect_uri': REDIRECT_URI,
        'state': state
    }
    
    auth_url = f"https://accounts.spotify.com/authorize?{urlencode(auth_params)}"
    response = RedirectResponse(url=auth_url)
    response.set_cookie(key=STATE_KEY, value=state, httponly=True, max_age=600) # 10 minutes
    return response

@app.get("/auth/callback")
async def callback(request: Request, code: str = None, state: str = None, error: str = None):
    """
    Handles the callback from Spotify after the user authorizes the app.
    Exchanges the authorization code for an access token.
    """
    stored_state = request.cookies.get(STATE_KEY)

    # Validate state to prevent CSRF
    if error or not state or state != stored_state:
        return RedirectResponse(url=f"{FRONTEND_URI}/?error=state_mismatch")

    # Exchange code for access token
    if code:
        auth_header = b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
        
        try:
            async with httpx.AsyncClient() as client:
                token_response = await client.post(
                    'https://accounts.spotify.com/api/token',
                    data={
                        'grant_type': 'authorization_code',
                        'code': code,
                        'redirect_uri': REDIRECT_URI,
                    },
                    headers={
                        'Authorization': f'Basic {auth_header}',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                )
                token_response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
            token_data = token_response.json()

            # Pass tokens to the frontend via query parameters
            access_token = token_data.get("access_token")
            refresh_token = token_data.get("refresh_token")
            
            if access_token:
                query_params = urlencode({"access_token": access_token, "refresh_token": refresh_token})
                redirect_url = f"{FRONTEND_URI}/?{query_params}"
                response = RedirectResponse(url=redirect_url)
                response.delete_cookie(STATE_KEY) # Clean up the state cookie
                return response
            
        except httpx.RequestError as e:
            return RedirectResponse(url=f"{FRONTEND_URI}/?error=token_exchange_failed")

    return RedirectResponse(url=f"{FRONTEND_URI}/?error=invalid_token")

# --- Server Startup ---
if __name__ == "__main__":
    import uvicorn
    # Allows running the server with `python main.py`
    uvicorn.run(app, host="0.0.0.0", port=8000) 