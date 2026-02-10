export type Role = 'super_admin' | 'faculty' | 'participant';

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  designation?: string;
}

export interface FDP {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: 'online' | 'offline' | 'hybrid';
  resourcePersons: string[];
  maxParticipants: number;
  status: 'draft' | 'active' | 'completed';
}
