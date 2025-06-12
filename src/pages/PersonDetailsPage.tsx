import React from 'react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import CoffeeHistoryItem from '../components/CoffeeHistoryItem';
import { Coffee, Plus } from 'lucide-react'; // Aggiungiamo l'icona Plus

const PersonDetailsPage: React.FC = () => {
  const { 
    people, 
    coffeeRecords, 
    selectedUserId, 
    selectUser, 
    setCurrentView,
    payCoffee,
    addCoffeeRecord // Aggiungiamo la funzione per aggiungere caffè
  } = useAppContext();
  
  if (!selectedUserId) {
    setCurrentView('home');
    return null;
  }
  
  const person = people.find(p => p.id === selectedUserId);
  
  if (!person) {
    setCurrentView('home');
    return null;
  }
  
  const personRecords = coffeeRecords
    .filter(record => record.user_id === selectedUserId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const handleBackClick = () => {
    selectUser(null);
    setCurrentView('home');
  };
  
  const handlePayClick = async (recordId: string) => {
    try {
      await payCoffee(recordId);
    } catch (error) {
      console.error('Error paying coffee:', error);
      alert('Failed to mark coffee as paid. Please try again.');
    }
  };

  // Nuova funzione per gestire il click sul pulsante "Add Coffee"
  const handleAddCoffeeClick = async () => {
    if (selectedUserId) {
      await addCoffeeRecord(selectedUserId);
      // L'alert di successo è già nella funzione addCoffeeRecord nel contesto
    }
  };
  
  return (
    <div className="pb-16 min-h-screen bg-gray-50">
      <Header 
        title={person.name} 
        showBack={true}
        onBackClick={handleBackClick}
      />
      
      <main className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Outstanding Coffees</h3>
                <p className="text-sm text-gray-500">Total: {person.coffeesOwed}</p>
              </div>
              
              {/* --- BOTTONE MODIFICATO --- */}
              <button
                onClick={handleAddCoffeeClick}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Add Coffee
              </button>
              
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-t-xl p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Coffee History</h3>
          
          <div className="divide-y divide-gray-100">
            {personRecords.map(record => (
              <CoffeeHistoryItem 
                key={record.id} 
                date={record.date} 
                paid={record.paid}
                onPayClick={() => handlePayClick(record.id)}
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
