import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';

export const FacultyDashboard = () => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    api.get('/analytics/faculty').then((res) => setData(res.data));
  }, []);

  if (!data) return <p className="text-cyan-200">Loading dashboard...</p>;

  const present = data.attendanceStats.find((x: any) => x._id === 'present')?.count || 0;
  const absent = data.attendanceStats.find((x: any) => x._id === 'absent')?.count || 0;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-blue-300/20 bg-slate-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-200/80">Coordinator Hub</p>
        <h2 className="mt-2 text-4xl font-black neon-title">Faculty Dashboard</h2>
        <p className="mt-2 text-sm text-slate-300">Track assigned FDPs, attendance behavior, and completion progress.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-cyan-500/20 to-transparent">
          <p className="text-sm text-slate-300">Assigned FDPs</p>
          <p className="text-4xl font-black text-white">{data.assignedFDPs.length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/20 to-transparent">
          <p className="text-sm text-slate-300">Present Records</p>
          <p className="text-4xl font-black text-white">{present}</p>
        </Card>
        <Card className="bg-gradient-to-br from-rose-500/20 to-transparent">
          <p className="text-sm text-slate-300">Absent Records</p>
          <p className="text-4xl font-black text-white">{absent}</p>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 text-lg font-semibold text-cyan-200">Completion Progress</h3>
        <div className="space-y-4">
          {data.completionProgress.map((p: any) => (
            <div key={p.fdpId}>
              <div className="mb-1 flex justify-between text-sm text-slate-300">
                <span>{p.title}</span>
                <span className="font-semibold text-cyan-200">{p.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-700/60">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_20px_rgba(56,189,248,0.65)]"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
