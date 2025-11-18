import React, { useEffect, useState } from 'react';
import GoalTracker from './GoalTracker';

export default function PatientDashboard(){
  const [summary, setSummary] = useState(null);

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
    </div>
  )
}
