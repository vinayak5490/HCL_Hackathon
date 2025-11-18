import React, { useState } from 'react';

export default function GoalTracker({ onSaved }){
  const [form, setForm] = useState({ steps: '', water_ml: '', sleep_hours: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          steps: Number(form.steps || 0),
          water_ml: Number(form.water_ml || 0),
          sleep_hours: Number(form.sleep_hours || 0),
          notes: form.notes,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');
      setForm({ steps: '', water_ml: '', sleep_hours: '', notes: '' });
      onSaved && onSaved(data.goal);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
      <h4 className="font-semibold">Log today's goals</h4>
      <div className="grid grid-cols-3 gap-2">
        <input name="steps" value={form.steps} onChange={onChange} placeholder="Steps" className="border p-2 rounded" />
        <input name="water_ml" value={form.water_ml} onChange={onChange} placeholder="Water (ml)" className="border p-2 rounded" />
        <input name="sleep_hours" value={form.sleep_hours} onChange={onChange} placeholder="Sleep (hrs)" className="border p-2 rounded" />
      </div>
      <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Notes" className="w-full border p-2 rounded" />
      <div className="flex justify-end">
        <button disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}
