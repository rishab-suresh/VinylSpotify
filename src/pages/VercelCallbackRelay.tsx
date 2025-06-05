import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const VercelCallbackRelay: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');
    const state = params.get('state'); // Spotify might also return a state param if we send one

    // Target your local development server's callback URL
    const localDevCallbackUrl = 'http://localhost:5173/callback';
    const redirectParams = new URLSearchParams();

    if (code) {
      redirectParams.set('code', code);
    }
    if (error) {
      redirectParams.set('error', error);
    }
    if (state) {
      redirectParams.set('state', state);
    }

    // Perform the redirect to the local development server
    window.location.href = `${localDevCallbackUrl}?${redirectParams.toString()}`;
  }, [location]);

  return (
    <div>
      <p>Please wait, redirecting to your local application...</p>
      <p>
        If you are not redirected automatically, please ensure your local development server 
        is running on <code>http://localhost:5173</code> and is set up to handle the 
        <code>/callback</code> route.
      </p>
    </div>
  );
};

export default VercelCallbackRelay; 