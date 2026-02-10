import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from './AdminDashboard';
import { FacultyDashboard } from './FacultyDashboard';

export const DashboardPage = () => {
  const { user } = useAuth();
  if (user?.role === 'super_admin') return <AdminDashboard />;
  if (user?.role === 'faculty') return <FacultyDashboard />;
  return <p className="text-lg">Welcome {user?.name}. Use sidebar to explore FDPs and certificates.</p>;
};
