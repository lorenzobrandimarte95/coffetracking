import { createContext, useContext, useState, useEffect } from 'react';
import { DBUser, CoffeeRecord, AppView } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  users: DBUser[];
  coffeeRecords: CoffeeRecord[];
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
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        setError(error.message);
      } else {
        setUsers(data || []);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  // Add a new coffee record
  const addCoffeeRecord = async (userId: string) => {
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

    // Refresh coffee records
    const { data: records } = await supabase
      .from('coffee_records')
      .select('*')
      .eq('user_id', userId);

    if (records) {
      setCoffeeRecords(records);
    }
  };

  // Add new user
  const addUser = async (userData: Omit<DBUser, 'id' | 'created_at'>) => {
    const { error } = await supabase
      .from('users')
      .insert([userData]);

    if (error) {
      setError(error.message);
      return;
    }

    // Refresh users list
    const { data: updatedUsers } = await supabase
      .from('users')
      .select('*');

    if (updatedUsers) {
      setUsers(updatedUsers);
    }
  };

  // Pay coffee
  const payCoffee = async (recordId: string) => {
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