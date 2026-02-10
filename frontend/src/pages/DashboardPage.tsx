import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from './AdminDashboard';
import { FacultyDashboard } from './FacultyDashboard';
import { ParticipantDashboard } from './ParticipantDashboard';

export const DashboardPage = () => {
  const { user } = useAuth();
  if (user?.role === 'super_admin') return <AdminDashboard />;
  if (user?.role === 'faculty') return <FacultyDashboard />;
  return <ParticipantDashboard />;
};
