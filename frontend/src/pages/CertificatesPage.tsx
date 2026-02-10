import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export const CertificatesPage = () => {
  const { user } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [fdpId, setFdpId] = useState('');
  const [participantId, setParticipantId] = useState('');

  const loadMine = () => api.get('/certificates/mine').then((res) => setCerts(res.data.certificates));
  useEffect(() => { if (user?.role === 'participant') loadMine(); }, [user?.role]);

  const generate = async () => {
    await api.post('/certificates/generate', { fdpId, participantId });
    alert('Certificate generated and emailed');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Certificates</h2>
      {(user?.role === 'super_admin' || user?.role === 'faculty') && (
        <div className="max-w-lg space-y-2 rounded bg-white p-4 shadow">
          <input className="w-full rounded border p-2" placeholder="FDP ID" value={fdpId} onChange={(e) => setFdpId(e.target.value)} />
          <input className="w-full rounded border p-2" placeholder="Participant ID" value={participantId} onChange={(e) => setParticipantId(e.target.value)} />
          <Button onClick={generate}>Generate Certificate</Button>
        </div>
      )}

      {user?.role === 'participant' && (
        <div className="grid gap-3">
          {certs.map((c) => (
            <div key={c._id} className="rounded bg-white p-4 shadow">
              <p className="font-medium">{c.fdp?.title}</p>
              <p className="text-sm">Certificate ID: {c.certificateId}</p>
              <a className="text-brand-700 underline" href={`http://localhost:5000/api/certificates/${c._id}/download`}>Download PDF</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
