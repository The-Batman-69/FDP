import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const itemClass = (active: boolean) =>
  `block rounded-xl px-3 py-2 text-sm transition ${active ? 'bg-white text-slate-900' : 'text-slate-200 hover:bg-slate-800'}`;

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const common = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/fdps', label: 'FDP Programs' }
  ];

  const roleLinks =
    user?.role === 'super_admin'
      ? [
          { to: '/fdps/new', label: 'Create FDP' },
          { to: '/certificates', label: 'Certificates' }
        ]
      : user?.role === 'faculty'
        ? [
            { to: '/attendance', label: 'Attendance' },
            { to: '/certificates', label: 'Certificates' }
          ]
        : [
            { to: '/register', label: 'Register FDP' },
            { to: '/certificates', label: 'My Certificates' }
          ];

  return (
    <aside className="hidden min-h-screen w-72 flex-col bg-slate-900 p-5 lg:flex">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
        <p className="text-xs uppercase tracking-wide text-blue-100">FDP Management</p>
        <h1 className="text-xl font-bold">Academic ERP</h1>
      </div>

      <nav className="space-y-1">
        {[...common, ...roleLinks].map((item) => (
          <Link key={item.to} to={item.to} className={itemClass(location.pathname === item.to)}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-slate-800 p-3 text-slate-200">
        <p className="text-xs">Logged in as</p>
        <p className="font-semibold">{user?.name}</p>
        <p className="text-xs capitalize">{user?.role?.replace('_', ' ')}</p>
        <button onClick={logout} className="mt-3 w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white">
          Logout
        </button>
      </div>
    </aside>
  );
};
