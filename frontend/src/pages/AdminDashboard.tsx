import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line
} from 'recharts';

const metricGradients = [
  'from-cyan-500/20 to-blue-500/5',
  'from-fuchsia-500/20 to-violet-500/5',
  'from-emerald-500/20 to-teal-500/5',
  'from-amber-500/20 to-orange-500/5'
];

export const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/analytics/admin').then((res) => setData(res.data));
  }, []);

  if (!data) return <p className="text-cyan-200">Loading dashboard...</p>;
  const colors = ['#22d3ee', '#60a5fa', '#a78bfa', '#34d399', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-900/60 p-6 shadow-[0_0_50px_rgba(34,211,238,0.18)]">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-14 left-1/3 h-36 w-36 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Control Center</p>
        <h2 className="mt-2 text-4xl font-black neon-title">Super Admin Dashboard</h2>
        <p className="mt-2 text-sm text-slate-300">Real-time institution insights for FDP governance and audit readiness.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(data.metrics).map(([k, v], i) => (
          <Card key={k} className={`bg-gradient-to-br ${metricGradients[i % metricGradients.length]}`}>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{k}</p>
            <p className="mt-3 text-4xl font-black text-white">{String(v)}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="h-80">
          <h3 className="mb-2 font-semibold text-cyan-200">FDP Participation Trend</h3>
          <ResponsiveContainer>
            <LineChart data={data.participationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#e2e8f0' }} />
              <Line type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-80">
          <h3 className="mb-2 font-semibold text-cyan-200">Department-wise Participation</h3>
          <ResponsiveContainer>
            <BarChart data={data.departmentParticipation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="department" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#e2e8f0' }} />
              <Bar dataKey="count" fill="#60a5fa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="h-80">
        <h3 className="mb-2 font-semibold text-cyan-200">Attendance Percentage by FDP</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data.attendancePercentage} dataKey="percentage" nameKey="fdp" outerRadius={110} label>
              {data.attendancePercentage.map((_: any, i: number) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#e2e8f0' }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
