import React from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showAdd?: boolean;
  onBackClick?: () => void;
  onAddClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showAdd = false,
  onBackClick,
  onAddClick
}) => {
  return (
    <header className="sticky top-0 bg-white shadow-sm z-10">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {showBack && (
            <button 
              onClick={onBackClick}
              className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        {showAdd && (
          <button 
            onClick={onAddClick}
            className="p-2 rounded-full bg-white text-orange-500 border border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <Plus size={20} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;