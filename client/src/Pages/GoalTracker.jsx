import React, { useState, useContext } from 'react';
import { api, authHeader } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function GoalTracker({ onSaved }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ steps:0, water_ml:0, sleep_hours:0, notes:'' });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/goals', form, authHeader(token));
      setMsg('Saved');
      if (onSaved) onSaved();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div>
      <h3>Log Today</h3>
      {msg && <div>{msg}</div>}
      <form onSubmit={submit}>
        <input name="steps" type="number" placeholder="Steps" onChange={e=>setForm(f=>({...f, steps: Number(e.target.value)}))} /><br/>
        <input name="water_ml" type="number" placeholder="Water (ml)" onChange={e=>setForm(f=>({...f, water_ml: Number(e.target.value)}))} /><br/>
        <input name="sleep_hours" type="number" placeholder="Sleep (hours)" step="0.1" onChange={e=>setForm(f=>({...f, sleep_hours: Number(e.target.value)}))} /><br/>
        <textarea name="notes" placeholder="Notes" onChange={e=>setForm(f=>({...f, notes: e.target.value}))} /><br/>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
