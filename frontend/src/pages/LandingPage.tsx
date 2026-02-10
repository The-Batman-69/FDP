import { Link } from 'react-router-dom';

export const LandingPage = () => (
  <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6">
    <div className="glass w-full rounded-3xl p-10 shadow-xl">
      <p className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">NAAC / NBA Ready</p>
      <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">FDP Management Platform</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Lovable-style modern academic ERP for Faculty Development Programs: registrations, attendance,
        certificates, and analytics in one place.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white" to="/login">
          Login
        </Link>
        <Link className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold" to="/signup">
          Participant Signup
        </Link>
      </div>
    </div>
  </div>
);
