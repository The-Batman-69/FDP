import { Link } from 'react-router-dom';

export const LandingPage = () => (
  <div className="mx-auto max-w-4xl px-4 py-16 text-center">
    <h1 className="text-4xl font-bold text-slate-900">Faculty Development Program Management System</h1>
    <p className="mt-4 text-slate-600">Academic ERP for NAAC/NBA-ready FDP lifecycle management.</p>
    <div className="mt-8 flex justify-center gap-3">
      <Link className="rounded bg-brand-500 px-4 py-2 text-white" to="/login">
        Login
      </Link>
      <Link className="rounded border px-4 py-2" to="/signup">
        Participant Signup
      </Link>
    </div>
  </div>
);
