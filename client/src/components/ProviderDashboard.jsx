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

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Assigned Patients</h3>
        {patients.length === 0 ? (
          <div className="text-sm text-gray-500">No assigned patients found.</div>
        ) : (
          <ul className="divide-y mt-2">
            {patients.map(p => (
              <li key={p._id} className="py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">Age: {p.age || '-'}</div>
                    <button onClick={() => setSelectedPatientId(p._id)} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-sm">View</button>
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
