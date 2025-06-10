// src/context/AppContext.tsx (CODICE DEFINITIVO)
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DBUser, CoffeeRecord, AppView, Person } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  users: DBUser[];
  coffeeRecords: CoffeeRecord[];
  people: Person[];
  currentView: AppView;
  selectedUserId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentView: (view: AppView) => void;
  addCoffeeRecord: (userId: string) => Promise<void>;
  selectUser: (userId: string | null) => void;
  addUser: (userData: Omit<DBUser, 'id' | 'created_at'>) => Promise<void>;
  payCoffee: (recordId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [coffeeRecords, setCoffeeRecords] = useState<CoffeeRecord[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Imposta a true all'inizio
  const [error, setError] = useState<string | null>(null);

  // --- LOGICA DI CARICAMENTO DATI RISCRITTA ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);

      if (!supabase) {
        setError("Database client not available. Check Supabase configuration.");
        setIsLoading(false);
        return;
      }

      try {
        // Carica utenti e record caffè in parallelo
        const [usersResponse, coffeeRecordsResponse] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('coffee_records').select('*')
        ]);

        if (usersResponse.error) throw usersResponse.error;
        if (coffeeRecordsResponse.error) throw coffeeRecordsResponse.error;
        
        const fetchedUsers = usersResponse.data || [];
        const fetchedCoffeeRecords = coffeeRecordsResponse.data || [];

        // Trasforma i record
        const transformedRecords = fetchedCoffeeRecords.map(record => ({ 
          ...record, 
          date: new Date(record.date) 
        }));

        // Calcola le persone basandosi sui dati appena caricati
        const calculatedPeople = fetchedUsers.map(user => {
          const userCoffeeRecords = transformedRecords.filter(
            record => record.user_id === user.id && !record.paid
          );
          return {
            id: user.id,
            name: user.name,
            coffeesOwed: userCoffeeRecords.length,
            color: '#CCCCCC',
            email: user.email,
          } as Person;
        });

        // Imposta tutti gli stati solo dopo che tutto è stato calcolato
        setUsers(fetchedUsers);
        setCoffeeRecords(transformedRecords);
        setPeople(calculatedPeople);

      } catch (e: any) {
        setError(e.message);
        setUsers([]);
        setCoffeeRecords([]);
        setPeople([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Esegui solo una volta al montaggio del componente

  const refreshData = async () => {
     if (!supabase) return;
     setIsLoading(true);
     const { data, error } = await supabase.from('coffee_records').select('*');
     if (data) {
       const transformed = data.map(r => ({...r, date: new Date(r.date)}));
       setCoffeeRecords(transformed);
       // Ricalcola people quando i record cambiano
       const newPeople = users.map(user => ({
         ...user,
         coffeesOwed: transformed.filter(rec => rec.user_id === user.id && !rec.paid).length,
         color: '#CCCCCC'
       }));
       setPeople(newPeople);
     }
     setIsLoading(false);
  }

// Inserisci questo codice in src/context/AppContext.tsx, sostituendo la vecchia funzione addCoffeeRecord

const addCoffeeRecord = async (userId: string) => {
  if (!supabase) {
    alert("Errore: Client Supabase non disponibile.");
    return;
  }

  console.log(`Tentativo di inserire un caffè per l'utente: ${userId}`);

  const { data, error } = await supabase
    .from('coffee_records')
    .insert([{
      user_id: userId,
      date: new Date().toISOString(),
      paid: false
    }])
    .select(); // Aggiungiamo .select() per avere un riscontro

  // Se c'è un errore, lo mostriamo in console e in un alert
  if (error) {
    console.error("--- ERRORE SPECIFICO NELL'INSERIMENTO DEL CAFFÈ ---", error);
    alert(`Errore da Supabase: ${error.message}`);
    setError(error.message);
    return;
  }

  console.log("Caffè inserito con successo:", data);
  await refreshData(); // Usiamo la funzione di refresh esistente
};
  
  const addUser = async (userData: Omit<DBUser, 'id' | 'created_at'>) => {
    if (!supabase) {
      setError("Database client not available.");
      return;
    }
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }
    if (newUser) {
      setUsers(current => [...current, newUser]);
      setPeople(current => [...current, {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        coffeesOwed: 0,
        color: '#CCCCCC'
      }]);
      setSelectedUserId(newUser.id);
      setCurrentView('log');
    }
  };

  const payCoffee = async (recordId: string) => {
    if (!supabase) {
      setError("Database client not available.");
      return;
    }
    const { error } = await supabase
      .from('coffee_records')
      .update({ paid: true })
      .eq('id', recordId);

    if (error) {
      setError(error.message);
    } else {
      await refreshData();
    }
  };

  return (
    <AppContext.Provider value={{
      users,
      coffeeRecords,
      people,
      currentView,
      selectedUserId,
      isLoading,
      error,
      setCurrentView,
      addCoffeeRecord,
      selectUser: setSelectedUserId,
      addUser,
      payCoffee
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
