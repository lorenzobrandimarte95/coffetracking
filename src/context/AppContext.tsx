// src/context/AppContext.tsx
import { createContext, useContext, useState, useEffect } from 'react'; //
import { DBUser, CoffeeRecord, AppView, Person } from '../types'; //
import { supabase } from '../lib/supabase'; //

interface AppContextType {
  users: DBUser[]; //
  coffeeRecords: CoffeeRecord[]; //
  people: Person[]; //
  currentView: AppView; //
  selectedUserId: string | null; //
  isLoading: boolean; //
  error: string | null; //
  
  // Actions
  setCurrentView: (view: AppView) => void; //
  addCoffeeRecord: (userId: string) => Promise<void>; //
  selectUser: (userId: string | null) => void; //
  addUser: (userData: Omit<DBUser, 'id' | 'created_at'>) => Promise<void>; //
  payCoffee: (recordId: string) => Promise<void>; //
}

const AppContext = createContext<AppContextType | undefined>(undefined); //

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [users, setUsers] = useState<DBUser[]>([]); //
  const [coffeeRecords, setCoffeeRecords] = useState<CoffeeRecord[]>([]); //
  const [people, setPeople] = useState<Person[]>([]); // Added people state
  const [currentView, setCurrentView] = useState<AppView>('home'); //
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); //
  const [isLoading, setIsLoading] = useState(false); //
  const [error, setError] = useState<string | null>(null); //

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!supabase) { //
        setError("Database client not available. Check Supabase configuration."); //
        setIsLoading(false); //
        return;
      }
      setIsLoading(true); //
      setError(null); //
      const { data, error: fetchError } = await supabase //
        .from('users') //
        .select('*'); //

      if (fetchError) { //
        setError(fetchError.message); //
        setUsers([]); // Clear users on error
      } else {
        setUsers(data || []); //
      }
      setIsLoading(false); //
    };

    fetchUsers(); //
  }, []); //

  // Fetch all coffee records
  useEffect(() => {
    const fetchCoffeeRecords = async () => {
      if (!supabase) { //
        // Error already set by fetchUsers or if supabase is globally missing
        // setError("Database client not available. Check Supabase configuration.");
        setIsLoading(false); // Ensure loading is false if supabase is not there
        setCoffeeRecords([]); // Ensure records are empty
        return;
      }
      setIsLoading(true); //
      // setError(null); // Don't nullify error if users fetch failed
      const { data, error: fetchError } = await supabase //
        .from('coffee_records') //
        .select('*'); //

      if (fetchError) { //
        setError(fetchError.message); //
        setCoffeeRecords([]); // Clear records on error
      } else {
        const transformedRecords = data //
          ? data.map(record => ({ ...record, date: new Date(record.date) })) //
          : [];
        setCoffeeRecords(transformedRecords); //
      }
      setIsLoading(false); //
    };

    fetchCoffeeRecords(); //
  }, []); // Runs on mount

  // Transform users and coffeeRecords to people
  useEffect(() => {
    if (!users.length) { //
      setPeople([]); //
      return;
    }

    const newPeople = users.map(user => { //
      const userCoffeeRecords = coffeeRecords.filter(record => record.user_id === user.id && !record.paid); //
      const coffeesOwed = userCoffeeRecords.length; //

      return {
        id: user.id, //
        name: user.name, //
        coffeesOwed: coffeesOwed, //
        color: '#CCCCCC', //
        email: user.email, //
      } as Person;
    });
    setPeople(newPeople); //
  }, [users, coffeeRecords]); //

  // Add a new coffee record
  const addCoffeeRecord = async (userId: string) => {
    if (!supabase) { //
      setError("Database client not available. Cannot add record."); //
      return;
    }
    const { error } = await supabase //
      .from('coffee_records') //
      .insert([{
        user_id: userId, //
        date: new Date().toISOString(), //
        paid: false //
      }]);

    if (error) { //
      setError(error.message); //
      return;
    }

    // Refresh ALL coffee records to update counts correctly
    // As per subtask, refetching all is acceptable for simplicity.
    // A more optimal solution would be to add the new record to the existing state.
    if (!error) { // Only refetch if insert was successful
      setIsLoading(true); // Optional: indicate loading for refetch
      const { data: allRecords, error: fetchError } = await supabase //
        .from('coffee_records') //
        .select('*'); //

      if (fetchError) { //
        setError(fetchError.message); //
      } else if (allRecords) {
        const transformedRecords = allRecords.map(record => ({ ...record, date: new Date(record.date) })); //
        setCoffeeRecords(transformedRecords); //
      }
      setIsLoading(false); // Optional: indicate end of loading for refetch
    }
  };

  // Add new user
  const addUser = async (userData: Omit<DBUser, 'id' | 'created_at'>) => {
    if (!supabase) { //
      setError("Database client not available. Cannot add user."); //
      return;
    }

    const { data: newUser, error: insertError } = await supabase //
      .from('users') //
      .insert([userData]) //
      .select('*') //
      .single(); //

    if (insertError) { //
      console.error('Error inserting user:', insertError); //
      setError(insertError.message); //
      return;
    }

    if (!newUser) { //
      setError("Failed to create user. No data returned."); //
      return;
    }

    if (
      typeof newUser.id === 'string' && newUser.id.trim() !== '' &&
      typeof newUser.name === 'string' && newUser.name.trim() !== '' &&
      typeof newUser.email === 'string' &&
      typeof newUser.created_at === 'string'
    ) {
      setUsers(currentUsers => [...currentUsers, newUser]); //

      const newPerson: Person = { //
        id: newUser.id, //
        name: newUser.name, //
        coffeesOwed: 0, //
        color: '#CCCCCC', //
        email: newUser.email, //
      };
      setPeople(currentPeople => [...currentPeople, newPerson]); //
      setSelectedUserId(newUser.id); // <--- Aggiungi questa riga per selezionare il nuovo utente
      setCurrentView('log'); // <--- Naviga alla pagina di log dopo l'aggiunta
    } else {
      console.warn("Invalid user data returned from database:", newUser); //
      setError("Failed to process new user data. Please try refreshing."); //
    }
  };

  // Pay coffee
  const payCoffee = async (recordId: string) => {
    if (!supabase) { //
      setError("Database client not available. Cannot pay coffee."); //
      return;
    }
    const { error } = await supabase //
      .from('coffee_records') //
      .update({ paid: true }) //
      .eq('id', recordId); //

    if (error) { //
      setError(error.message); //
      return;
    }

    setCoffeeRecords(prev => //
      prev.map(record => //
        record.id === recordId ? { ...record, paid: true } : record //
      )
    );
  };

  return (
    <AppContext.Provider value={{
      users, //
      coffeeRecords, //
      people, // Added people
      currentView, //
      selectedUserId, //
      isLoading, //
      error, //
      setCurrentView, //
      addCoffeeRecord, //
      selectUser: setSelectedUserId, //
      addUser, //
      payCoffee //
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext); //
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider'); //
  }
  return context; //
};