import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout = () => (
  <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Sidebar />
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <Outlet />
    </main>
  </div>
);
