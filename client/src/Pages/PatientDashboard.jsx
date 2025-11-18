import React, { useContext, useEffect, useState } from 'react';
import { api, authHeader } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import GoalTracker from '../components/GoalTracker';
import { Link } from 'react-router-dom';

export default function Dashboard(){
  const { token, user, logout } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!token) return;
    api.get('/goals/today', authHeader(token)).then(r => setSummary(r.data)).catch(e => console.error(e));
  }, [token]);

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={logout}>Logout</button> | <Link to="/profile">Edit Profile</Link>
      <section>
        <h3>Today's Summary</h3>
        {summary ? (
          <div>
            <div>Date: {summary.date}</div>
            <div>Tip: {summary.tipOfTheDay}</div>
            <div>Completion: Steps {summary.completion.steps}% | Water {summary.completion.water}% | Sleep {summary.completion.sleep}%</div>
          </div>
        ) : (<div>Loading...</div>)}
      </section>

      <GoalTracker onSaved={() => api.get('/goals/today', authHeader(token)).then(r => setSummary(r.data))} />
    </div>
  );
}
