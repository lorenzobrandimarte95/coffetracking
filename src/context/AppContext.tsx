import { createContext, useContext, useState, useEffect } from 'react';
import { DBUser, CoffeeRecord, AppView, Person } from '../types'; // Added Person
import { supabase } from '../lib/supabase';

interface AppContextType {
  users: DBUser[];
  coffeeRecords: CoffeeRecord[];
  people: Person[]; // Added people
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

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [coffeeRecords, setCoffeeRecords] = useState<CoffeeRecord[]>([]);
  const [people, setPeople] = useState<Person[]>([]); // Added people state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!supabase) {
        setError("Database client not available. Check Supabase configuration.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*');

      if (fetchError) {
        setError(fetchError.message);
        setUsers([]); // Clear users on error
      } else {
        setUsers(data || []);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  // Fetch all coffee records
  useEffect(() => {
    const fetchCoffeeRecords = async () => {
      if (!supabase) {
        // Error already set by fetchUsers or if supabase is globally missing
        // setError("Database client not available. Check Supabase configuration.");
        setIsLoading(false); // Ensure loading is false if supabase is not there
        setCoffeeRecords([]); // Ensure records are empty
        return;
      }
      setIsLoading(true);
      // setError(null); // Don't nullify error if users fetch failed
      const { data, error: fetchError } = await supabase
        .from('coffee_records')
        .select('*');

      if (fetchError) {
        setError(fetchError.message);
        setCoffeeRecords([]); // Clear records on error
      } else {
        const transformedRecords = data
          ? data.map(record => ({ ...record, date: new Date(record.date) }))
          : [];
        setCoffeeRecords(transformedRecords);
      }
      setIsLoading(false);
    };

    fetchCoffeeRecords();
  }, []); // Runs on mount

  // Transform users and coffeeRecords to people
  useEffect(() => {
    if (!users.length) { // If no users, no people to create or users fetch failed
        setPeople([]);
        return;
    }

    const newPeople = users.map(user => {
      const userCoffeeRecords = coffeeRecords.filter(record => record.user_id === user.id && !record.paid);
      const coffeesOwed = userCoffeeRecords.length;

      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar_url, // Map avatar_url to avatar
        coffeesOwed: coffeesOwed,
        color: '#CCCCCC', // Default color
        email: user.email,
        department: user.department,
      } as Person; // Type assertion if necessary for stricter type checking
    });
    setPeople(newPeople);
  }, [users, coffeeRecords]); // Re-run when users or coffeeRecords change

  // Add a new coffee record
  const addCoffeeRecord = async (userId: string) => {
    if (!supabase) {
      setError("Database client not available. Cannot add record.");
      return;
    }
    const { error } = await supabase
      .from('coffee_records')
      .insert([{
        user_id: userId,
        date: new Date().toISOString(),
        paid: false
      }]);

    if (error) {
      setError(error.message);
      return;
    }

    // Refresh ALL coffee records to update counts correctly
    // As per subtask, refetching all is acceptable for simplicity.
    // A more optimal solution would be to add the new record to the existing state.
    if (!error) { // Only refetch if insert was successful
      setIsLoading(true); // Optional: indicate loading for refetch
      const { data: allRecords, error: fetchError } = await supabase
        .from('coffee_records')
        .select('*');

      if (fetchError) {
        setError(fetchError.message);
      } else if (allRecords) {
        const transformedRecords = allRecords.map(record => ({ ...record, date: new Date(record.date) }));
        setCoffeeRecords(transformedRecords);
      }
      setIsLoading(false); // Optional: indicate end of loading for refetch
    }
  };

  // Add new user
  const addUser = async (userData: Omit<DBUser, 'id' | 'created_at'>) => {
    if (!supabase) {
      setError("Database client not available. Cannot add user.");
      return;
    }

    // Chain .select() to get the inserted record back
    const { data: newInsertedUsers, error } = await supabase
      .from('users')
      .insert([userData])
      .select();

    if (error) {
      setError(error.message);
      return;
    }

    // Stricter validation for the returned user data
    if (newInsertedUsers && newInsertedUsers.length > 0) {
      const potentialNewUser = newInsertedUsers[0];

      // Validate essential fields
      if (
        potentialNewUser &&
        typeof potentialNewUser.id === 'string' && potentialNewUser.id.trim() !== '' &&
        typeof potentialNewUser.name === 'string' && potentialNewUser.name.trim() !== '' &&
        typeof potentialNewUser.avatar_url === 'string' && // Allows empty string for avatar_url
        typeof potentialNewUser.email === 'string' && // Basic check, could be stricter regex
        typeof potentialNewUser.department === 'string' && // Allows empty string
        typeof potentialNewUser.created_at === 'string' // Basic check, could be Date validation
      ) {
        const validatedNewUser: DBUser = {
          id: potentialNewUser.id,
          name: potentialNewUser.name,
          email: potentialNewUser.email,
          avatar_url: potentialNewUser.avatar_url,
          department: potentialNewUser.department,
          created_at: potentialNewUser.created_at,
        };
        setUsers(currentUsers => [...currentUsers, validatedNewUser]);
      } else {
        console.warn(
          "Validation failed for new user data returned by Supabase. User not added to local state.",
          "Received data:", potentialNewUser
        );
        setError("Failed to process new user data from database. Please try refreshing.");
      }
    } else if (!error) { // No Supabase error from insert, but newInsertedUsers is null or empty
      console.warn(
        "User insert succeeded according to Supabase, but no user data was returned. Check RLS policies or .select() statement.",
        "newInsertedUsers:", newInsertedUsers
      );
      // Optionally set an error for the user, or just log for developer awareness.
      // setError("New user added, but couldn't immediately display. Please try refreshing."); // Example error for UI
    }
    // The 'error' variable from the insert operation is already handled before this block.
  };

  // Pay coffee
  const payCoffee = async (recordId: string) => {
    if (!supabase) {
      setError("Database client not available. Cannot pay coffee.");
      return;
    }
    const { error } = await supabase
      .from('coffee_records')
      .update({ paid: true })
      .eq('id', recordId);

    if (error) {
      setError(error.message);
      return;
    }

    setCoffeeRecords(prev =>
      prev.map(record =>
        record.id === recordId ? { ...record, paid: true } : record
      )
    );
  };

  return (
    <AppContext.Provider value={{
      users,
      coffeeRecords,
      people, // Added people
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