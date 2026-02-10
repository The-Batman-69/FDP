import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';

export const FacultyDashboard = () => {
  const [data, setData] = useState<any>();
  useEffect(() => {
    api.get('/analytics/faculty').then((res) => setData(res.data));
  }, []);
  if (!data) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Faculty Dashboard</h2>
      <Card><p>Assigned FDPs: <strong>{data.assignedFDPs.length}</strong></p></Card>
      <Card><h3 className="font-medium">Completion Progress</h3><ul className="mt-2 space-y-2">{data.completionProgress.map((p: any) => <li key={p.fdpId}>{p.title} - {p.progress}%</li>)}</ul></Card>
      <Card><h3 className="font-medium">Attendance Stats</h3><ul>{data.attendanceStats.map((x: any) => <li key={x._id}>{x._id}: {x.count}</li>)}</ul></Card>
    </div>
  );
};
