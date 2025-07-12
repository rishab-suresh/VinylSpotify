# Spotify Vinyl Player

This project is a web application that visualizes your currently playing Spotify track as a spinning vinyl record. It uses the Spotify Web Playback SDK to stream music directly in your browser.

The entire application runs directly in your browser. There is no backend server to manage.

## Features

-   **Real-time Playback:** Streams your Spotify music directly.
-   **Vinyl Visualization:** Shows your current track's album art on a spinning record.
-   **Queue Display:** Lists your upcoming tracks.
-   **Theming:** Switch between different visual themes for the player.
-   **No Backend Required:** Runs entirely in the browser using the secure PKCE authentication flow.

## How It Works

This application uses two key pieces of Spotify's technology to function:

-   **Web Playback SDK:** This is the specialized library that turns this web application into a virtual "speaker". It handles the streaming of audio directly to your browser and makes the "Vinyl Player" appear in your list of available Spotify Connect devices.

-   **Web API with PKCE:** This application uses the Authorization Code Flow with PKCE to securely authenticate you without needing a backend server or exposing any secret keys.

In short, the **Playback SDK** is the *player*, and the **Web API** is the *remote control*.

## Setup and Installation

Follow these steps to get the application running locally.

### 1. Spotify API Credentials

To connect to Spotify, you need to create an application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

1.  Click **"Create App"**.
2.  Give your app a name and description.
3.  Once created, go to the app's **Settings**.
4.  Copy your **Client ID**. You do not need the Client Secret.
5.  In the settings, you must also add a **Redirect URI**. For the local version to work, add the following URI:
    ```
    http://localhost:3000/
    ```
    If you deploy this application (e.g., on Vercel), you will need to add that deployment URL to the list of Redirect URIs as well.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

```bash
npm start
```

The frontend will run on `http://localhost:3000` and should open automatically in your browser.

The first time you open the app, it will ask you for the **Client ID** you copied from the Spotify Developer Dashboard. Paste it into the form to connect the app to your Spotify account.

You can now log in and start playing music!
