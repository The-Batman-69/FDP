import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

export const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    api.get('/analytics/admin').then((res) => setData(res.data));
  }, []);
  if (!data) return <p>Loading...</p>;

  const colors = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {Object.entries(data.metrics).map(([k, v]) => (
          <Card key={k}><p className="text-sm text-slate-500">{k}</p><p className="text-2xl font-bold">{String(v)}</p></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="h-72"><h3 className="mb-2 font-medium">Participation Trend</h3><ResponsiveContainer><LineChart data={data.participationTrend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Line type="monotone" dataKey="count" stroke="#2563eb"/></LineChart></ResponsiveContainer></Card>
        <Card className="h-72"><h3 className="mb-2 font-medium">Dept. Participation</h3><ResponsiveContainer><BarChart data={data.departmentParticipation}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="department"/><YAxis/><Tooltip/><Bar dataKey="count" fill="#16a34a"/></BarChart></ResponsiveContainer></Card>
      </div>
      <Card className="h-72"><h3 className="mb-2 font-medium">Attendance % by FDP</h3><ResponsiveContainer><PieChart><Pie data={data.attendancePercentage} dataKey="percentage" nameKey="fdp" outerRadius={90} label>{data.attendancePercentage.map((_: any, i: number) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie></PieChart></ResponsiveContainer></Card>
    </div>
  );
};
