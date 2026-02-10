import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';

const statusClass = (status: string) => {
  if (status === 'approved') return 'bg-emerald-500/20 text-emerald-200 border-emerald-300/30';
  if (status === 'rejected') return 'bg-rose-500/20 text-rose-200 border-rose-300/30';
  return 'bg-amber-500/20 text-amber-200 border-amber-300/30';
};

export const ParticipantDashboard = () => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    api.get('/analytics/participant').then((res) => setData(res.data));
  }, []);

  if (!data) return <p className="text-cyan-200">Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-fuchsia-300/20 bg-slate-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200/80">Learner Command</p>
        <h2 className="mt-2 text-4xl font-black neon-title">Participant Dashboard</h2>
        <p className="mt-2 text-sm text-slate-300">Monitor registrations, approvals, and certificates in one futuristic view.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(data.stats).map(([k, v], idx) => (
          <Card key={k} className={idx % 2 === 0 ? 'bg-gradient-to-br from-fuchsia-500/20 to-transparent' : 'bg-gradient-to-br from-cyan-500/20 to-transparent'}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{k}</p>
            <p className="text-4xl font-black text-white">{String(v)}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="mb-3 text-lg font-semibold text-cyan-200">Registration Timeline</h3>
        <div className="space-y-2">
          {data.timeline.map((row: any, i: number) => (
            <div key={`${row.title}-${i}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/70 p-3 text-sm">
              <span className="text-slate-200">{row.title}</span>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(row.status)}`}>{row.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
