import React from 'react';
import { Home, Coffee, User, Settings } from 'lucide-react';
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map(item => (
            <button
              key={item.view}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors duration-200 ${
                currentView === item.view
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setCurrentView(item.view)}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;