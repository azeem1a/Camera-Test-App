import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CameraTestPage from './pages/CameraTestPage';

// Routing is intentionally minimal for easy reading.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/camera-test" element={<CameraTestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
