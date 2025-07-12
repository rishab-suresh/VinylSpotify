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
5.  In the settings, you must also add your **Redirect URIs**. You will need to add a URI for your local development environment and another for your deployed application.

    -   **For local development**, add this exact URI:
        ```
        http://127.0.0.1:3000/
        ```
    -   **For your deployed site** (e.g., on Vercel), you must add its public URL. For example:
        ```
        https://vinyl-spotify.vercel.app/
        ```
    You can add multiple Redirect URIs. It is important that both your local and deployed URLs are listed in your Spotify app settings.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

```bash
npm start
```

The frontend will run on `http://127.0.0.1:3000` and should open automatically in your browser.

The first time you open the app, it will ask you for the **Client ID** you copied from the Spotify Developer Dashboard. Paste it into the form to connect the app to your Spotify account.

You can now log in and start playing music!
