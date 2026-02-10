import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

type FormValues = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: 'online' | 'offline' | 'hybrid';
  maxParticipants: number;
  status: 'draft' | 'active' | 'completed';
  resourcePersons: string;
};

export const FdpManagePage = ({ createMode = false }: { createMode?: boolean }) => {
  const [fdps, setFdps] = useState<any[]>([]);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>();

  const load = () => api.get('/fdps').then((res) => setFdps(res.data.fdps));
  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      setError('');
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, String(v)));
      await api.post('/fdps', formData);
      reset();
      load();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Unable to create FDP');
    }
  };

  return (
    <div className="space-y-5">
      {createMode && (
        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-3 text-2xl font-black">Create FDP Program</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input className="rounded-xl border p-2.5" placeholder="Title" {...register('title', { required: true })} />
            <input className="rounded-xl border p-2.5" placeholder="Description" {...register('description', { required: true })} />
            <input type="date" className="rounded-xl border p-2.5" {...register('startDate', { required: true })} />
            <input type="date" className="rounded-xl border p-2.5" {...register('endDate', { required: true })} />
            <select className="rounded-xl border p-2.5" {...register('mode')}>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <input type="number" className="rounded-xl border p-2.5" placeholder="Max participants" {...register('maxParticipants')} />
            <input className="rounded-xl border p-2.5" placeholder="Resource persons (comma separated)" {...register('resourcePersons')} />
            <select className="rounded-xl border p-2.5" {...register('status')}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <Button type="submit" className="rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create FDP'}
            </Button>
          </form>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}

      <div>
        <h3 className="mb-2 text-xl font-bold">All FDP Programs</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {fdps.map((f) => (
            <div key={f._id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-bold">{f.title}</p>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase">{f.status}</span>
              </div>
              <p className="text-sm text-slate-600">{f.description}</p>
              <p className="mt-2 text-xs text-slate-500">
                {new Date(f.startDate).toLocaleDateString()} - {new Date(f.endDate).toLocaleDateString()} • {f.mode}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
