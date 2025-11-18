import React, { useEffect, useState } from 'react';
import GoalTracker from './GoalTracker';
import DoctorPicker from './DoctorPicker';

export default function PatientDashboard(){
  const [summary, setSummary] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/goals/today', { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(d => setSummary(d))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Today's Summary</h3>
        <div className="mt-2 text-right">
          <button onClick={() => setShowPicker(true)} className="px-3 py-1 bg-indigo-600 text-white rounded">Book a Doctor</button>
        </div>
        {summary ? (
          <div>
            <div>Tip: {summary.tipOfTheDay}</div>
            <div>Steps completion: {summary.completion?.steps}%</div>
            <div>Water completion: {summary.completion?.water}%</div>
            <div>Sleep completion: {summary.completion?.sleep}%</div>
          </div>
        ) : <div>Loading...</div>}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Goal Tracker</h3>
        <p className="text-sm text-gray-600">Use the form below to log your daily goals.</p>
        <div className="mt-3">
          <GoalTracker onSaved={(g) => setSummary(prev => ({ ...prev, goal: g }))} />
        </div>
      </div>
      {showPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg max-w-2xl w-full p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Select a Doctor</h4>
              <button onClick={() => setShowPicker(false)} className="px-2 py-1 border rounded">Close</button>
            </div>
            <DoctorPicker onClose={() => setShowPicker(false)} onBooked={(appt) => { setShowPicker(false); alert('Appointment booked'); }} />
          </div>
        </div>
      )}
    </div>
  )
}
