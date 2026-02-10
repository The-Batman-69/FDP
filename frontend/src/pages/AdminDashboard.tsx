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

export const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    api.get('/analytics/admin').then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading dashboard...</p>;
  const colors = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#7c3aed'];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-black">Super Admin Dashboard</h2>
        <p className="text-sm text-slate-500">Institution-wide FDP insights and controls.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(data.metrics).map(([k, v]) => (
          <Card key={k} className="rounded-2xl border-0 bg-gradient-to-br from-white to-blue-50">
            <p className="text-xs uppercase tracking-wider text-slate-500">{k}</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{String(v)}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="h-80 rounded-2xl">
          <h3 className="mb-2 font-semibold">FDP Participation Trend</h3>
          <ResponsiveContainer>
            <LineChart data={data.participationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-80 rounded-2xl">
          <h3 className="mb-2 font-semibold">Department-wise Participation</h3>
          <ResponsiveContainer>
            <BarChart data={data.departmentParticipation}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="h-80 rounded-2xl">
        <h3 className="mb-2 font-semibold">Attendance Percentage by FDP</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data.attendancePercentage} dataKey="percentage" nameKey="fdp" outerRadius={110} label>
              {data.attendancePercentage.map((_: any, i: number) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
