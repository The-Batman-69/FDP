import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export const FdpRegistrationPage = () => {
  const [fdps, setFdps] = useState<any[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState('');

  const load = () => {
    api.get('/fdps/public/list').then((res) => setFdps(res.data.fdps));
    api.get('/fdps/my-registrations').then((res) => setMyRegistrations(res.data.registrations));
  };

  useEffect(() => {
    load();
  }, []);

  const registeredMap = useMemo(() => {
    const map = new Map<string, string>();
    myRegistrations.forEach((r) => map.set(r.fdp?._id, r.status));
    return map;
  }, [myRegistrations]);

  const registerFdp = async (id: string) => {
    setMessage('');
    setError('');
    setLoadingId(id);
    try {
      await api.post(`/fdps/${id}/register`, new FormData());
      setMessage('Registration submitted successfully. Confirmation email has been triggered.');
      load();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed.');
    } finally {
      setLoadingId('');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-black">Register for FDP</h2>
        <p className="text-sm text-slate-500">Browse active programs and register instantly.</p>
      </div>

      {message && <p className="rounded-xl bg-green-100 p-3 text-sm text-green-700">{message}</p>}
      {error && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fdps.map((f) => {
          const regStatus = registeredMap.get(f._id);
          return (
            <div key={f._id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="text-lg font-bold">{f.title}</p>
              <p className="mt-1 line-clamp-3 text-sm text-slate-600">{f.description}</p>
              <div className="mt-3 text-xs text-slate-500">
                <p>
                  {new Date(f.startDate).toLocaleDateString()} - {new Date(f.endDate).toLocaleDateString()}
                </p>
                <p className="capitalize">Mode: {f.mode}</p>
              </div>

              {regStatus ? (
                <p className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Already Registered ({regStatus})
                </p>
              ) : (
                <Button className="mt-4 w-full rounded-xl" onClick={() => registerFdp(f._id)} disabled={loadingId === f._id}>
                  {loadingId === f._id ? 'Registering...' : 'Register'}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
