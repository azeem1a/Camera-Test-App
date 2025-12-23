import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

/**
 * Home page is intentionally plain: title and a single button.
 * No camera logic lives here to keep responsibilities clear.
 */
function HomePage() {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/camera-test');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow border border-slate-200 p-8 text-center space-y-6 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Camera Test App</h1>
          <p className="text-slate-600">
            A simple way to check if your browser camera works.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={handleStartTest}>Start Camera Test</Button>
          <p className="text-xs text-slate-500">
            No data leaves your browser. Access is requested only when you start.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
