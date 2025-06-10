// src/pages/LogPage.tsx
import React, { useState, useEffect } from 'react'; // Importa useEffect
import { useAppContext } from '../context/AppContext'; //
import Header from '../components/Header'; //
import { Calendar, Clock } from 'lucide-react'; //

const LogPage: React.FC = () => {
  const { people, addCoffeeRecord, setCurrentView, selectedUserId, selectUser } = useAppContext(); // Usa selectedUserId dal contesto
  const [localSelectedUserId, setLocalSelectedUserId] = useState<string>(selectedUserId || ''); // Nuovo stato locale per il dropdown, inizializzato con selectedUserId del contesto
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); //
  const [time, setTime] = useState<string>( //
    new Date().toTimeString().split(' ')[0].substring(0, 5) //
  );

  // Sincronizza lo stato locale del dropdown con selectedUserId del contesto
  useEffect(() => {
    setLocalSelectedUserId(selectedUserId || '');
  }, [selectedUserId]); //

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localSelectedUserId) { // Usa localSelectedUserId
      alert('Please select a person');
      return;
    }
    
    try {
      await addCoffeeRecord(localSelectedUserId); // Usa localSelectedUserId
      setCurrentView('home'); //
      selectUser(null); // Deseleziona l'utente dopo l'aggiunta del caffè
    } catch (error) {
      console.error('Error adding coffee record:', error); //
      alert('Failed to add coffee record. Please try again.'); //
    }
  };
  
  const handleBackClick = () => {
    setCurrentView('home'); //
    selectUser(null); // Assicurati di deselezionare l'utente quando torni indietro
  };

  const handlePersonSelect = (userId: string) => {
    setLocalSelectedUserId(userId); // Aggiorna solo lo stato locale del dropdown
    selectUser(userId); // Questo aggiorna selectedUserId nel contesto, per coerenza
  };
  
  return (
    <div className="pb-16 min-h-screen bg-gray-50">
      <Header 
        title="Add Coffee" 
        showBack={true}
        onBackClick={handleBackClick}
      />
      
      <main className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Person
            </label>
            <div className="relative">
              <select
                value={localSelectedUserId} // Usa lo stato locale sincronizzato
                onChange={(e) => handlePersonSelect(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select Person</option>
                {people.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Date & Time
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full p-3 pl-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="block w-full p-3 pl-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            Add Coffee
          </button>
        </form>
      </main>
    </div>
  );
};

export default LogPage;