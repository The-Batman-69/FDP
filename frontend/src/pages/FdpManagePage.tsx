import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export const FdpManagePage = ({ createMode = false }: { createMode?: boolean }) => {
  const [fdps, setFdps] = useState<any[]>([]);
  const { register, handleSubmit, reset } = useForm<any>();

  const load = () => api.get('/fdps').then((res) => setFdps(res.data.fdps));
  useEffect(() => { load(); }, []);

  const onSubmit = async (values: any) => {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v) formData.append(k, v as string);
    });
    await api.post('/fdps', formData);
    reset();
    load();
  };

  return (
    <div className="space-y-4">
      {createMode && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 rounded bg-white p-4 shadow md:grid-cols-2">
          <input className="rounded border p-2" placeholder="Title" {...register('title')} />
          <input className="rounded border p-2" placeholder="Description" {...register('description')} />
          <input type="date" className="rounded border p-2" {...register('startDate')} />
          <input type="date" className="rounded border p-2" {...register('endDate')} />
          <select className="rounded border p-2" {...register('mode')}><option value="online">Online</option><option value="offline">Offline</option><option value="hybrid">Hybrid</option></select>
          <input type="number" className="rounded border p-2" placeholder="Max participants" {...register('maxParticipants')} />
          <input type="text" className="rounded border p-2" placeholder="status active/draft/completed" {...register('status')} />
          <Button type="submit">Create FDP</Button>
        </form>
      )}
      <div className="grid gap-3">
        {fdps.map((f) => (
          <div key={f._id} className="rounded bg-white p-4 shadow">
            <p className="text-lg font-semibold">{f.title}</p>
            <p className="text-sm text-slate-600">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
