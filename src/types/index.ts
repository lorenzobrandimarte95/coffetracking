export interface Person {
  id: string;
  name: string;
  avatar?: string;
  coffeesOwed: number;
  color: string;
  email?: string;
}

export interface DBUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface CoffeeRecord {
  id: string;
  user_id: string;
  date: Date;
  paid: boolean;
  created_at: string;
}

export type AppView = 'home' | 'log' | 'profile';

export interface UserFormData {
  name: string;
  email: string;
}