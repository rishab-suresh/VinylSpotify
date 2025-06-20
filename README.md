# Skeuomorphic Spotify Vinyl Player

This project aims to build a visually-rich, skeuomorphic vinyl player interface that connects to the Spotify API to play a user's playlists, combining modern web technologies with a nostalgic design.

## Tech Stack & Core Concepts

This project is built with a modern, robust tech stack designed for scalability and a good developer experience. Below is an explanation of the key concepts and architectural decisions.

- **React & TypeScript:** For building a type-safe, component-based user interface.
- **Vite:** A next-generation build tool that provides extremely fast development server startup and builds.
- **Redux Toolkit:** For centralized and predictable state management.
- **Vercel:** Used for deployment and, crucially, as part of our authentication strategy.

---

### Concept 1: The Modern Authentication Flow (PKCE + Redirect Relay)

Connecting to Spotify securely from a browser-based application requires a multi-step process. We've implemented a robust flow that combines two key concepts.

#### 1a. PKCE (Proof Key for Code Exchange)

Because our app runs in a browser, it cannot keep a "client secret" confidential. PKCE is the industry-standard security extension to the OAuth 2.0 protocol that solves this problem.

-   **What it is:** A cryptographic challenge where our app proves it is the legitimate source of the login request.
-   **How it works:**
    1.  Before redirecting to Spotify, our app generates a secret `code_verifier`.
    2.  It then creates a public `code_challenge` from that verifier.
    3.  When we ask Spotify to log the user in, we send the public `code_challenge`.
    4.  After the user logs in, Spotify sends us back a temporary `authorization_code`.
    5.  Our app then makes a direct, behind-the-scenes request to Spotify's token endpoint, sending both the `authorization_code` and the original secret `code_verifier`.
    6.  Spotify verifies that the secret matches the public challenge before issuing the final, powerful `access_token`.
-   **Code Reference:** The helper functions for this process are located in `src/utils/pkceUtils.ts` (lines 4 and 15).

#### 1b. The Vercel Redirect Relay

Many modern API providers, including Spotify, have security policies that disallow `http://localhost` as a redirect destination. To work around this for local development, we use our live Vercel deployment as a secure middleman.

-   **What it is:** A live, HTTPS-enabled page on Vercel whose only job is to "catch" the redirect from Spotify and forward it back to our local machine.
-   **How it works:**
    1.  In the Spotify Developer Dashboard, our **Redirect URI is set to our Vercel URL** (`https://vinyl-spotify.vercel.app/` as of this writing).
    2.  When Spotify authenticates a user, it sends them to that Vercel URL with the `authorization_code`.
    3.  The React component at that route (`/callback` on Vercel) immediately redirects the user's browser to `http://localhost:5173/callback`, carrying the code along.
-   **Code Reference:** The logic for this relay is in `src/pages/VercelCallbackRelay.tsx`. The two different URIs are configured in `src/config/authConfig.ts` (lines 8 and 11).

---

### Concept 2: Centralized State with Redux Toolkit

To manage the application's state (like authentication status, user info, playlists, etc.), we use Redux Toolkit.

-   **What it is:** The official, recommended way to write Redux logic. It simplifies store setup and reduces boilerplate.
-   **`createAsyncThunk` for API Calls:** For asynchronous operations like fetching our access token, we use `createAsyncThunk`. This provides a structured way to handle the `pending`, `fulfilled` (success), and `rejected` (error) states of an API call.
-   **How it works:**
    1.  When our app receives the `authorization_code` from Spotify, we `dispatch` our `exchangeCodeForToken` thunk.
    2.  This thunk performs the `fetch` request to Spotify's token endpoint.
    3.  Based on the outcome, the thunk automatically dispatches the appropriate action (`pending`, `fulfilled`, or `rejected`).
    4.  Our `authSlice` listens for these actions in its `extraReducers` block and updates the application state accordingly (e.g., storing the access token or an error message).
-   **Code Reference:** The entire authentication logic is defined in our auth slice at `src/store/slices/authSlice.ts`. The `exchangeCodeForToken` thunk is defined on line 25, and the state-updating logic is in the `extraReducers` on line 81.

---

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   A Spotify Developer account and an application created on the dashboard.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd spotify-vinyl-player
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Spotify Redirect URI:**
    *   Deploy the current state of the project to Vercel (or another hosting provider).
    *   In your Spotify Developer Dashboard, go to your application's settings and set the **Redirect URI** to your live deployment's URL (e.g., `https://your-app.vercel.app/`).
    *   Open `src/config/authConfig.ts` and ensure the `redirectUri` on line 8 matches the URL you just set in the Spotify dashboard.

### Running the App Locally

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Open your browser** to `http://localhost:5173`.

The application should now be running. When you attempt to log in, you will be redirected through Spotify and your Vercel deployment before landing back on your local application.
