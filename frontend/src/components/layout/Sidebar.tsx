import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const common = [{ to: '/dashboard', label: 'Dashboard' }, { to: '/fdps', label: 'FDP Programs' }];
  const roleLinks =
    user?.role === 'super_admin'
      ? [
          { to: '/fdps/new', label: 'Create FDP' },
          { to: '/certificates', label: 'Certificates' }
        ]
      : user?.role === 'faculty'
        ? [{ to: '/attendance', label: 'Attendance' }]
        : [{ to: '/register', label: 'Register FDP' }, { to: '/certificates', label: 'My Certificates' }];

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-900 p-4 text-white">
      <h1 className="mb-6 text-xl font-bold">FDP ERP</h1>
      <nav className="space-y-1">
        {[...common, ...roleLinks].map((item) => (
          <Link key={item.to} to={item.to} className="block rounded px-3 py-2 hover:bg-slate-800">
            {item.label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="mt-auto rounded bg-red-600 px-3 py-2 text-sm">
        Logout
      </button>
    </aside>
  );
};
