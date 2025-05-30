import { Person, CoffeeRecord } from '../types';
import { generateId } from '../utils/helpers';

export const initialPeople: Person[] = [
  {
    id: generateId(),
    name: 'Ethan',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600',
    coffeesOwed: 3,
    color: '#f87171'
  },
  {
    id: generateId(),
    name: 'Sophia',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
    coffeesOwed: 2,
    color: '#60a5fa'
  },
  {
    id: generateId(),
    name: 'Liam',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
    coffeesOwed: 1,
    color: '#4ade80'
  },
  {
    id: generateId(),
    name: 'Olivia',
    avatar: 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=600',
    coffeesOwed: 4,
    color: '#c084fc'
  },
  {
    id: generateId(),
    name: 'Noah',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600',
    coffeesOwed: 2,
    color: '#facc15'
  },
  {
    id: generateId(),
    name: 'Ava',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    coffeesOwed: 3,
    color: '#ec4899'
  }
];

// Generate records for the past two weeks
export const generateInitialRecords = (): CoffeeRecord[] => {
  const records: CoffeeRecord[] = [];
  
  initialPeople.forEach(person => {
    // Generate records based on coffeesOwed count
    for (let i = 0; i < person.coffeesOwed; i++) {
      const daysAgo = Math.floor(Math.random() * 14); // Random day in the past 2 weeks
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      // Random time between 8:00 and 17:00
      date.setHours(8 + Math.floor(Math.random() * 9));
      date.setMinutes(Math.floor(Math.random() * 60));
      
      records.push({
        id: generateId(),
        personId: person.id,
        date: date,
        paid: false
      });
    }
  });
  
  return records;
};