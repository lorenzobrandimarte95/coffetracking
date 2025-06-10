import React from 'react';
import { Home, Coffee, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AppView } from '../types';

const Navigation: React.FC = () => {
  const { currentView, setCurrentView } = useAppContext();
  
  const navItems: {view: AppView, icon: React.ReactNode, label: string}[] = [
    { view: 'home', icon: <Home size={24} />, label: 'Home' },
    { view: 'log', icon: <Coffee size={24} />, label: 'Log' },
    { view: 'profile', icon: <User size={24} />, label: 'Profile' }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 border-t border-gray-200 backdrop-blur-sm">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => (
            <button
              key={item.view}
              // Stile migliorato per l'elemento attivo
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                currentView === item.view
                  ? 'text-orange-500'
                  : 'text-gray-400 hover:text-orange-500'
              }`}
              onClick={() => setCurrentView(item.view)}
            >
              {item.icon}
              <span className="text-xs font-medium mt-1">{item.label}</span>
              {currentView === item.view && (
                <div className="absolute bottom-1 w-5 h-1 bg-orange-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
