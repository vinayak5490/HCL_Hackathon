import React, { useEffect, useState } from 'react';

export default function PatientDetail({ patientId }){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`/api/provider/patients/${patientId}/goals`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (!patientId) return <div className="text-sm text-gray-500">Select a patient to view details.</div>;
  if (loading) return <div>Loading patient...</div>;
  if (!data) return <div className="text-sm text-red-500">Unable to load patient details.</div>;

  return (
    <div>
      <h4 className="font-semibold">{data.patient.name}</h4>
      <div className="text-sm text-gray-500">{data.patient.email}</div>
      <div className="mt-2"><strong>Recent goals</strong></div>
      <ul className="mt-2 divide-y">
        {data.goals.map(g => (
          <li key={g._id} className="py-2">
            <div className="text-sm">{new Date(g.date).toLocaleString()}</div>
            <div className="text-sm">Steps: {g.steps || 0} — Water: {g.water_ml || 0}ml — Sleep: {g.sleep_hours || 0}h</div>
            <div className="text-xs text-gray-500">Notes: {g.notes || '-'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
