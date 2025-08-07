# Spotify Vinyl Player

This project is a web application that visualizes your currently playing Spotify track as a spinning vinyl record. It uses the Spotify Web Playback SDK to stream music directly in your browser.

The entire application runs directly in your browser. There is no backend server to manage.

## Features

-   **Real-time Playback:** Streams your Spotify music directly.
-   **Vinyl Visualization:** Shows your current track's album art on a spinning record.
-   **Queue Display:** Lists your upcoming tracks.
-   **Multiple Themes:** Switch between different visual themes for the player (Dark, Wood, Floral, Aqua).
-   **No Backend Required:** Runs entirely in the browser using the secure PKCE authentication flow.
-   **Session-based login:** The session ends when you close your browser tab, ensuring privacy.

## How It Works

-   **Web Playback SDK:** This application uses Spotify's SDK to turn the browser into a virtual "speaker," allowing it to stream audio directly and appear in your Spotify Connect device list.
-   **Web API with PKCE:** The app uses the Authorization Code Flow with PKCE to securely authenticate you without needing a backend server or exposing any secret keys.

## Setup and Installation

### 1. Spotify API Credentials

To connect to Spotify, you need to create an application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

1.  Click **"Create App"**.
2.  Give your app a name and description.
3.  Once created, go to the app's **Settings**.
4.  Copy your **Client ID**.
5.  In the settings, you must add your **Redirect URIs**. The URI must exactly match the URL you use to run your app locally.
    -   **Important for local development:** Your browser can use either `http://localhost:3000/` or `http://127.0.0.1:3000/`. To be safe, it's best to **add both** of these to your list of allowed Redirect URIs in the Spotify Developer Dashboard.
    -   For your **deployed site** (e.g., on Vercel), add its public URL, for example: `https://your-app-name.vercel.app/`

### 2. Environment Variables

This project requires a Spotify Client ID to function. The method for providing it depends on your environment:

-   **For Vercel Deployment:** The application is configured to automatically use environment variables set in your Vercel project dashboard. Simply create an environment variable named `REACT_APP_SPOTIFY_CLIENT_ID` and set its value to your Spotify Client ID.

-   **For Local Development:** To run the project on your local machine, you must create a `.env` file in the root directory.
    1.  Create a file named `.env`.
    2.  Add your Spotify Client ID to this file:
        ```env
        REACT_APP_SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID_HERE
        ```
        Replace `YOUR_SPOTIFY_CLIENT_ID_HERE` with the actual ID you copied from your Spotify Developer Dashboard.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm start
```

The frontend will run on `http://127.0.0.1:3000` and should open automatically in your browser.

You can now log in with your Spotify account and start playing music!
