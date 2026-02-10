import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export const FdpRegistrationPage = () => {
  const [fdps, setFdps] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  useEffect(() => { api.get('/fdps').then((res) => setFdps(res.data.fdps)); }, []);

  const register = async (id: string) => {
    await api.post(`/fdps/${id}/register`);
    setMessage('Registration submitted successfully. Check email for updates.');
  };

  return (
    <div>
      <h2 className="mb-3 text-2xl font-semibold">Register for FDP</h2>
      {message && <p className="mb-3 text-green-600">{message}</p>}
      <div className="grid gap-3">
        {fdps.map((f) => (
          <div key={f._id} className="rounded bg-white p-4 shadow">
            <p className="font-semibold">{f.title}</p>
            <p className="text-sm text-slate-600">{f.description}</p>
            <Button className="mt-2" onClick={() => register(f._id)}>Register</Button>
          </div>
        ))}
      </div>
    </div>
  );
};
