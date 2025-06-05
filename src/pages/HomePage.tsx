import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import PersonCard from '../components/PersonCard';
import { Plus, Coffee } from 'lucide-react';

const HomePage: React.FC = () => {
  const { people, selectPerson, setCurrentView } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  
  const handlePersonClick = (personId: string) => {
    selectPerson(personId);
    setCurrentView('log');
  };
  
  const handleAddClick = () => {
    // Open add coffee modal or navigate to add coffee page
    setCurrentView('log');
  };
  
  return (
    <div className="pb-16 min-h-screen bg-gray-50">
      <Header 
        title="Coffee Tracker" 
        showAdd={true}
        onAddClick={handleAddClick}
      />
      
      <main className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Outstanding Coffees</h2>
        
        <div>
          {people
            .filter(person => person.coffeesOwed > 0)
            .sort((a, b) => b.coffeesOwed - a.coffeesOwed)
            .map(person => (
              <PersonCard 
                key={person.id} 
                person={person} 
                onClick={handlePersonClick} 
              />
            ))}
        </div>
        
        {people.filter(person => person.coffeesOwed > 0).length === 0 && (
          <div className="text-center py-10">
            <div className="text-gray-400 mb-4">
              <Coffee size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500">No outstanding coffees</p>
            <button 
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center justify-center mx-auto hover:bg-orange-600 transition-colors"
              onClick={handleAddClick}
            >
              <Plus size={20} className="mr-2" />
              Add Coffee
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;