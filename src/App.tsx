import { Routes, Route } from 'react-router-dom';
import VercelCallbackRelay from './pages/VercelCallbackRelay'; // We just created this
import './App.css'; // Assuming you have some basic styles

// Placeholder for your main page/login page content
const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Spotify Skeuomorphic Player</h1>
      <p>This is the main application page.</p>
      <p>Authentication will be set up here soon.</p>
      {/* Login button will go here */}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/callback" element={<VercelCallbackRelay />} />
    </Routes>
  );
};

export default App;
