import React from 'react';
import { Coffee } from 'lucide-react';
import { Person } from '../types';

interface PersonCardProps {
  person: Person;
  onClick: (personId: string) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onClick }) => {
  const coffeeIndicators = Array.from({ length: person.coffeesOwed }, (_, i) => (
    <div 
      key={i}
      className="h-4 w-4 rounded-full"
      style={{ backgroundColor: person.color }}
    />
  ));
  
  // URL dinamico per generare un avatar con le iniziali del nome
  const avatarUrl = person.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&color=fff`;

  return (
    <div 
      className="bg-white rounded-xl shadow-sm mb-3 p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(person.id)}
    >
      <div className="flex items-center">
        <div className="relative">
          <img 
            src={avatarUrl}
            alt={person.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-gray-200" 
          />
          <div 
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
            style={{ 
              backgroundColor: person.color,
              boxShadow: '0 0 0 2px white'
            }}
          >
            {person.coffeesOwed}
          </div>
        </div>
        
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
          <div className="flex mt-1 space-x-1">
            {coffeeIndicators}
          </div>
        </div>
      </div>
      
      <Coffee className="text-gray-400" size={24} />
    </div>
  );
};

export default PersonCard;
