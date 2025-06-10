// src/pages/PersonDetailsPage.tsx (CON CODICE DI DEBUG)
import React from 'react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import CoffeeHistoryItem from '../components/CoffeeHistoryItem';
import { Coffee } from 'lucide-react';

const PersonDetailsPage: React.FC = () => {
  const { 
    people, 
    coffeeRecords, 
    selectedUserId, 
    selectUser, 
    setCurrentView,
    payCoffee
  } = useAppContext();
  
  // Trova la persona selezionata
  const person = people.find(p => p.id === selectedUserId);
  
  // Filtra i record per questa persona
  const personRecords = coffeeRecords
    .filter(record => record.user_id === selectedUserId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // =================================================================
  // --- INIZIO BLOCCO DI DEBUG ---
  console.log("--- DEBUG: Pagina Dettagli Utente ---");
  console.log("ID Utente Selezionato:", selectedUserId);
  console.log("Oggetto 'person' trovato:", person);
  console.log("Tutti i 'people' dal contesto:", people);
  console.log("Tutti i 'coffeeRecords' dal contesto:", coffeeRecords);
  console.log("Record filtrati per questa persona:", personRecords);
  console.log("-----------------------------------------");
  // --- FINE BLOCCO DI DEBUG ---
  // =================================================================
  
  // Se nessuna persona è selezionata, torna alla home
  if (!selectedUserId) {
    setCurrentView('home');
    return null;
  }
  
  // Se l'oggetto persona non viene trovato nell'array 'people', torna alla home
  if (!person) {
    console.error("ERRORE: Impossibile trovare la persona con l'ID fornito. Torno alla home.");
    setCurrentView('home');
    return null;
  }
  
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
              {person.coffeesOwed > 0 && (
                <button
                  onClick={() => handlePayClick(personRecords[0]?.id)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Pay One
                </button>
              )}
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
