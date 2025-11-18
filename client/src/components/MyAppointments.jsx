import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function MyAppointments(){
  const { token } = useAuth();
  const [appointments, setAppointments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/appointments/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setAppointments(d.appointments || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div>Loading appointments...</div>;

  if (!appointments || appointments.length === 0) return <div>No upcoming appointments.</div>;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">My Appointments</h3>
      <div className="grid grid-cols-1 gap-3">
        {appointments.map(a => (
          <div key={a._id} className="p-3 border rounded bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.doctor?.name} <span className="text-sm text-gray-500">{a.doctor?.specialty}</span></div>
                <div className="text-sm text-gray-500">{a.doctor?.clinic} • {a.doctor?.city}</div>
                <div className="text-xs text-gray-400">{a.doctor?.phone}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{new Date(a.scheduledAt).toLocaleString()}</div>
                <div className="text-xs text-gray-500">Status: {a.status}</div>
              </div>
            </div>
            {a.notes && <div className="mt-2 text-sm">Notes: {a.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
