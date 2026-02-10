import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout = () => (
  <div className="flex">
    <Sidebar />
    <main className="min-h-screen flex-1 bg-slate-50 p-6">
      <Outlet />
    </main>
  </div>
);
