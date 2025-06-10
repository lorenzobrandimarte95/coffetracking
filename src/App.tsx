// src/App.tsx (corretto)
import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import HomePage from './pages/HomePage';
import LogPage from './pages/LogPage';
import PersonDetailsPage from './pages/PersonDetailsPage';
import ProfilePage from './pages/ProfilePage';
import Navigation from './components/Navigation';
import { supabaseInitializationError } from './lib/supabase';

const AppContent: React.FC = () => {
  // --- UNICA MODIFICA QUI ---
  const { currentView, selectedUserId } = useAppContext(); // Corretto da selectedPersonId a selectedUserId

  if (supabaseInitializationError) {
    return (
      <div className="min-h-screen bg-red-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Application Initialization Error</h1>
          <p className="text-gray-700 mb-2">
            There was a problem starting the application:
          </p>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded mb-4">
            {supabaseInitializationError}
          </p>
          <p className="text-gray-600">
            Please ensure that <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> are correctly configured in your environment variables.
          </p>
          <p className="text-gray-600 mt-2">
            If you are deploying this application (e.g., on Vercel), please double-check the environment variable settings in your deployment configuration.
          </p>
        </div>
      </div>
    );
  }

  // Questa logica ora funzionerà correttamente con la variabile giusta
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {currentView === 'home' && <HomePage />}
      {currentView === 'log' && (
        selectedUserId ? <PersonDetailsPage /> : <LogPage />
      )}
      {currentView === 'profile' && <ProfilePage />}
      <Navigation />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
