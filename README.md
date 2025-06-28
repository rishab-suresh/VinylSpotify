# Spotify Vinyl Player

This project is a web application that visualizes your currently playing Spotify track as a spinning vinyl record. It uses the Spotify Web Playback SDK to stream music directly in the browser and a FastAPI backend to handle the OAuth 2.0 authentication flow.

## Features

-   **Real-time Playback:** Streams your Spotify music directly.
-   **Vinyl Visualization:** Shows your current track's album art on a spinning record.
-   **Queue Display:** Lists your upcoming tracks.
-   **Theming:** Switch between different visual themes for the player.

## How It Works

This application uses two key pieces of Spotify's technology to function:

-   **Web Playback SDK:** This is the specialized library that turns this web application into a virtual "speaker". It handles the streaming of audio directly to your browser and makes the "Vinyl Player" appear in your list of available Spotify Connect devices.

-   **Web API:** This is the standard REST API used to send commands and get information. We use the Web API to tell the Playback SDK what to do (play, pause, skip track) and to retrieve the current queue.

In short, the **Playback SDK** is the *player*, and the **Web API** is the *remote control*.

## Setup and Installation

Follow these steps to get the application running locally.

### 1. Spotify API Credentials

To connect to Spotify, you need to create an application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

1.  Click **"Create App"**.
2.  Give your app a name and description.
3.  Once created, go to the app's **Settings**.
4.  You will need your **Client ID** and **Client Secret**.
5.  In the settings, you must also add a **Redirect URI**. For this project's default configuration, add the following URI:
    ```
    http://127.0.0.1:8000/auth/callback
    ```

### 2. Environment Variables

This project uses a `.env` file to manage secret keys.

1.  Create a new file named `.env` in the root directory of the project.
2.  Add your Spotify credentials to this file like so:

    ```env
    VITE_SPOTIFY_CLIENT_ID="YOUR_SPOTIFY_CLIENT_ID"
    VITE_SPOTIFY_CLIENT_SECRET="YOUR_SPOTIFY_CLIENT_SECRET"
    ```

    Replace `"YOUR_SPOTIFY_CLIENT_ID"` and `"YOUR_SPOTIFY_CLIENT_SECRET"` with the actual credentials from your Spotify Developer Dashboard.

### 3. Install Dependencies

The project has both a Python backend and a React frontend, each with its own dependencies.

-   **Backend (Python):**
    ```bash
    # It's recommended to use a virtual environment
    python -m venv venv
    source venv/bin/activate # On Windows, use `venv\Scripts\activate`

    # Install Python packages
    python -m pip install -r server/requirements.txt
    ```

-   **Frontend (React):**
    ```bash
    npm install
    ```

### 4. Run the Application

You need to run both the backend and frontend servers simultaneously in two separate terminals.

-   **Terminal 1: Start the Backend Server**
    ```bash
    python -m uvicorn main:app --reload --app-dir server
    ```
    The backend will run on `http://127.0.0.1:8000`.

-   **Terminal 2: Start the Frontend Server**
    ```bash
    npm start
    ```
    The frontend will run on `http://localhost:3001` and should open automatically in your browser.

You can now log in with your Spotify account and start playing music!
