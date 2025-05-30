import React from 'react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import CoffeeHistoryItem from '../components/CoffeeHistoryItem';
import { Coffee } from 'lucide-react';

const PersonDetailsPage: React.FC = () => {
  const { 
    people, 
    coffeeRecords, 
    selectedPersonId, 
    selectPerson, 
    setCurrentView,
    payCoffee
  } = useAppContext();
  
  // If no person is selected, redirect to home
  if (!selectedPersonId) {
    setCurrentView('home');
    return null;
  }
  
  const person = people.find(p => p.id === selectedPersonId);
  
  if (!person) {
    setCurrentView('home');
    return null;
  }
  
  const personRecords = coffeeRecords
    .filter(record => record.personId === selectedPersonId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const handleBackClick = () => {
    selectPerson(null);
    setCurrentView('home');
  };
  
  const handlePayClick = () => {
    if (person.coffeesOwed > 0) {
      payCoffee(selectedPersonId, 1);
    }
  };
  
  return (
    <div className="pb-16 min-h-screen bg-gray-50">
      <Header 
        title="Coffee History" 
        showBack={true}
        onBackClick={handleBackClick}
      />
      
      <main className="max-w-md mx-auto">
        <div className="bg-white p-6 mb-6 flex flex-col items-center">
          <div className="relative mb-2">
            <img 
              src={person.avatar} 
              alt={person.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" 
            />
            <div 
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-bold"
              style={{ 
                backgroundColor: person.color,
                boxShadow: '0 0 0 2px white'
              }}
            >
              {person.coffeesOwed}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-2">{person.name}</h2>
          <p className="text-gray-600 flex items-center mt-1">
            <span>Coffees to pay:</span>
            <span className="ml-2 font-bold text-orange-500">{person.coffeesOwed}</span>
          </p>
          
          {person.coffeesOwed > 0 && (
            <button 
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              onClick={handlePayClick}
            >
              Mark One as Paid
            </button>
          )}
        </div>
        
        <div className="bg-white rounded-t-xl p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Coffee Details</h3>
          
          <div className="divide-y divide-gray-100">
            {personRecords.map(record => (
              <CoffeeHistoryItem 
                key={record.id} 
                date={record.date} 
                paid={record.paid} 
              />
            ))}
            
            {personRecords.length === 0 && (
              <div className="py-8 text-center">
                <Coffee size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No coffee records found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonDetailsPage;