import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';

export const ParticipantDashboard = () => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    api.get('/analytics/participant').then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-black">Participant Dashboard</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(data.stats).map(([k, v]) => (
          <Card key={k} className="rounded-2xl">
            <p className="text-xs uppercase tracking-widest text-slate-500">{k}</p>
            <p className="text-3xl font-black">{String(v)}</p>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl">
        <h3 className="mb-3 font-semibold">Registration Timeline</h3>
        <div className="space-y-2">
          {data.timeline.map((row: any, i: number) => (
            <div key={`${row.title}-${i}`} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm">
              <span>{row.title}</span>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">{row.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
