import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export const AttendancePage = () => {
  const [fdpId, setFdpId] = useState('');
  const [date, setDate] = useState('');
  const [sessionName, setSessionName] = useState('Morning Session');
  const [participantId, setParticipantId] = useState('');

  const markSingle = async (status: 'present' | 'absent') => {
    await api.post('/attendance', { fdpId, date, sessionName, rows: [{ participantId, status }] });
    alert('Attendance marked');
  };

  return (
    <div className="max-w-xl space-y-3">
      <h2 className="text-2xl font-semibold">Attendance Management</h2>
      <input className="w-full rounded border p-2" placeholder="FDP ID" value={fdpId} onChange={(e) => setFdpId(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="Participant ID" value={participantId} onChange={(e) => setParticipantId(e.target.value)} />
      <input type="date" className="w-full rounded border p-2" value={date} onChange={(e) => setDate(e.target.value)} />
      <input className="w-full rounded border p-2" value={sessionName} onChange={(e) => setSessionName(e.target.value)} />
      <div className="flex gap-2">
        <Button onClick={() => markSingle('present')}>Mark Present</Button>
        <Button className="bg-slate-700" onClick={() => markSingle('absent')}>Mark Absent</Button>
      </div>
      <a className="text-brand-700 underline" href={`http://localhost:5000/api/attendance/${fdpId}/export/excel`} target="_blank">Export Attendance Excel</a>
    </div>
  );
};
