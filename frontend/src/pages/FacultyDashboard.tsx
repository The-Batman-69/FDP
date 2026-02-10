import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';

export const FacultyDashboard = () => {
  const [data, setData] = useState<any>();
  useEffect(() => {
    api.get('/analytics/faculty').then((res) => setData(res.data));
  }, []);
  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-black">Faculty Dashboard</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="rounded-2xl">
          <p className="text-sm text-slate-500">Assigned FDPs</p>
          <p className="text-3xl font-bold">{data.assignedFDPs.length}</p>
        </Card>
        <Card className="rounded-2xl">
          <p className="text-sm text-slate-500">Present Records</p>
          <p className="text-3xl font-bold">{data.attendanceStats.find((x: any) => x._id === 'present')?.count || 0}</p>
        </Card>
        <Card className="rounded-2xl">
          <p className="text-sm text-slate-500">Absent Records</p>
          <p className="text-3xl font-bold">{data.attendanceStats.find((x: any) => x._id === 'absent')?.count || 0}</p>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <h3 className="mb-2 font-semibold">Completion Progress</h3>
        <div className="space-y-3">
          {data.completionProgress.map((p: any) => (
            <div key={p.fdpId}>
              <div className="mb-1 flex justify-between text-sm"><span>{p.title}</span><span>{p.progress}%</span></div>
              <div className="h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${p.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
