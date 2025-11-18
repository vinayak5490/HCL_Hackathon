import React, { useEffect, useState } from 'react';
import PatientDetail from './PatientDetail';

export default function ProviderDashboard(){
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/provider/patients', {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setPatients(d.patients || []))
      .catch(() => setPatients([]));
  }, []);

  const statusColor = (s) => {
    if (!s) return 'bg-gray-200 text-gray-700';
    if (s === 'Goal Met') return 'bg-green-100 text-green-800';
    if (s === 'Partial') return 'bg-yellow-100 text-yellow-800';
    if (s === 'At Risk') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Assigned Patients</h3>
        {patients.length === 0 ? (
          <div className="text-sm text-gray-500">No assigned patients found.</div>
        ) : (
          <ul className="divide-y mt-2">
            {patients.map(p => (
              <li key={p._id} className="py-2 cursor-pointer hover:bg-gray-50" onClick={() => setSelectedPatientId(p._id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.email}</div>
                    <div className="text-xs text-gray-400">Last goal: {p.latestGoalDate || 'No recent goals'}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">Age: {p.age || '-'}</div>
                    <div className={`px-2 py-1 rounded text-xs ${statusColor(p.complianceStatus)}`}>{p.complianceStatus}</div>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedPatientId(p._id); }} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-sm">Open</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <PatientDetail patientId={selectedPatientId} />
      </div>
    </div>
  )
}
