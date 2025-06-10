import React from 'react';
import { Coffee } from 'lucide-react';
import { Person } from '../types';

interface PersonCardProps {
  person: Person;
  onClick: (personId: string) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onClick }) => {
  const avatarUrl = person.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&color=fff`;

  return (
    <div 
      // Aggiunte classi per l'animazione e l'ombra
      className="bg-white rounded-xl shadow-md mb-3 p-4 flex items-center justify-between hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ease-in-out cursor-pointer"
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
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ 
              backgroundColor: person.color || '#f59e0b', // Aggiunto un colore di fallback
              boxShadow: '0 0 0 3px white'
            }}
          >
            {person.coffeesOwed}
          </div>
        </div>
        
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-800">{person.name}</h3>
          <p className="text-sm text-gray-500">{person.coffeesOwed} coffees owed</p>
        </div>
      </div>
      
      <Coffee className="text-gray-300" size={24} />
    </div>
  );
};

export default PersonCard;
