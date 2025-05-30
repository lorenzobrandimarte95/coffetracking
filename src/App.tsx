import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import HomePage from './pages/HomePage';
import LogPage from './pages/LogPage';
import PersonDetailsPage from './pages/PersonDetailsPage';
import ProfilePage from './pages/ProfilePage';
import Navigation from './components/Navigation';

const AppContent: React.FC = () => {
  const { currentView, selectedPersonId } = useAppContext();
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {currentView === 'home' && <HomePage />}
      {currentView === 'log' && (
        selectedPersonId ? <PersonDetailsPage /> : <LogPage />
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