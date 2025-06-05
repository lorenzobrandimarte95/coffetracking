import React, { useState } from 'react'; // Added useState
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import AddUserForm from '../../components/AddUserForm'; // Added AddUserForm import
import { User, Coffee, Clock, Info, ChevronRight } from 'lucide-react'; // ChevronRight might be unused after change

const ProfilePage: React.FC = () => {
  const { people, coffeeRecords, addUser } = useAppContext(); // Added addUser
  const [showAddUserForm, setShowAddUserForm] = useState(false); // Added state for form visibility
  
  // Calculate total coffees
  const totalCoffees = coffeeRecords.length;
  
  // Calculate total owed
  const totalOwed = people.reduce((acc, person) => acc + person.coffeesOwed, 0);
  
  // Person who owes the most
  const topDebtor = [...people]
    .sort((a, b) => b.coffeesOwed - a.coffeesOwed)
    .filter(person => person.coffeesOwed > 0)[0];
  
  return (
    <div className="pb-16 min-h-screen bg-gray-50">
      <Header title="Profile" />
      
      <main className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-orange-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">Office Coffee Tracker</h2>
              <p className="text-gray-500">Track and manage coffee debts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
          <h3 className="text-lg font-semibold p-4 border-b border-gray-100">Statistics</h3>
          
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-500">{totalCoffees}</div>
              <div className="text-sm text-gray-500">Total Coffees</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-500">{totalOwed}</div>
              <div className="text-sm text-gray-500">Outstanding</div>
            </div>
          </div>
          
          {topDebtor && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={topDebtor.avatar} 
                  alt={topDebtor.name} 
                  className="w-10 h-10 rounded-full object-cover" 
                />
                <div className="ml-3">
                  <div className="font-medium">{topDebtor.name}</div>
                  <div className="text-sm text-gray-500">Top debtor</div>
                </div>
              </div>
              <div 
                className="px-2 py-1 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: topDebtor.color,
                  color: 'white'
                }}
              >
                {topDebtor.coffeesOwed} coffees
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <h3 className="text-lg font-semibold p-4 border-b border-gray-100">Settings</h3>
          
          <div className="divide-y divide-gray-100">
            <button
              className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              onClick={() => setShowAddUserForm(true)} // Changed onClick
            >
              <div className="flex items-center">
                <Coffee size={20} className="text-gray-400" />
                <span className="ml-3">Manage People</span>
              </div>
              {/* <ChevronRight size={18} className="text-gray-400" /> Removed ChevronRight */}
            </button>
            
            <button className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Clock size={20} className="text-gray-400" />
                <span className="ml-3">History</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            
            <button className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Info size={20} className="text-gray-400" />
                <span className="ml-3">About</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {showAddUserForm && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Person</h3>
            <AddUserForm
              performAddUser={addUser}
              onFormClose={() => setShowAddUserForm(false)}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;