import React, { useState } from 'react';
import { UserFormData } from '../types';

// Define the function type for adding a user
type addUserFunction = (userData: UserFormData) => Promise<void>;

interface AddUserFormProps {
  performAddUser: addUserFunction;
  onFormClose: () => void; // To be called on successful submission or cancellation
}

const AddUserForm: React.FC<AddUserFormProps> = ({ performAddUser, onFormClose }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await performAddUser(formData);
      onFormClose(); // Close form on successful submission
    } catch (error) {
      console.error('Error adding user:', error);
      // Display a more user-friendly error, or use a toast notification system
      alert('Failed to add user. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onFormClose} // Changed from onCancel to onFormClose
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Add User
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;