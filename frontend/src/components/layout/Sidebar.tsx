import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const itemClass = (active: boolean) =>
  `block rounded-xl px-3 py-2 text-sm transition ${
    active
      ? 'border border-cyan-300/30 bg-cyan-400/15 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.28)]'
      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
  }`;

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
    <aside className="hidden min-h-screen w-72 flex-col border-r border-cyan-300/10 bg-slate-950/80 p-5 backdrop-blur-xl lg:flex">
      <div className="mb-8 rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-blue-600/50 via-indigo-500/40 to-fuchsia-500/45 p-4 text-white shadow-[0_0_35px_rgba(59,130,246,0.35)]">
        <p className="text-xs uppercase tracking-wide text-cyan-100">FDP Management</p>
        <h1 className="text-xl font-bold">Academic ERP</h1>
      </div>

      <nav className="space-y-1">
        {[...common, ...roleLinks].map((item) => (
          <Link key={item.to} to={item.to} className={itemClass(location.pathname === item.to)}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-slate-200">
        <p className="text-xs">Logged in as</p>
        <p className="font-semibold">{user?.name}</p>
        <p className="text-xs capitalize">{user?.role?.replace('_', ' ')}</p>
        <button
          onClick={logout}
          className="mt-3 w-full rounded-lg bg-gradient-to-r from-rose-600 to-red-500 px-3 py-2 text-sm font-medium text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};
