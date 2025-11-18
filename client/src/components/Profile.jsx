import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile(){
  const { user, token, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: '',
    weight: '',
    allergies: '',
    medications: '',
    consent: false,
  });
  const [original, setOriginal] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const initial = {
        name: user.name || '',
        age: user.age || '',
        weight: user.weight || '',
        allergies: user.allergies || '',
        medications: user.medications || '',
        consent: !!user.consent,
      };
      setForm(initial);
      setOriginal(initial);
    }
  }, [user]);

  function updateField(e){
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSave(e){
    e.preventDefault();
    setSaving(true);
    try{
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Failed to save'); setSaving(false); return; }
      // update local auth user
      login(token, data.user);
      const updated = {
        name: data.user.name || '',
        age: data.user.age || '',
        weight: data.user.weight || '',
        allergies: data.user.allergies || '',
        medications: data.user.medications || '',
        consent: !!data.user.consent,
      };
      setForm(updated);
      setOriginal(updated);
      setEditing(false);
      alert('Profile saved');
    }catch(err){
      console.error(err); alert('Save failed');
    }finally{ setSaving(false); }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Profile</h3>
        <div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="px-3 py-1 bg-indigo-600 text-white rounded">Edit</button>
          ) : (
            <>
              <button onClick={() => { setForm(original); setEditing(false); }} className="px-3 py-1 mr-2 border rounded">Cancel</button>
              <button form="profileForm" type="submit" className="px-3 py-1 bg-green-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </>
          )}
        </div>
      </div>

      <form id="profileForm" onSubmit={handleSave} className="mt-4 max-w-xl">
        <label className="block text-sm">Full name</label>
        {editing ? (
          <input name="name" value={form.name} onChange={updateField} className="w-full p-2 border rounded mb-3" />
        ) : (
          <div className="w-full p-2 mb-3 text-gray-700">{form.name || '-'}</div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Age</label>
            {editing ? (
              <input name="age" value={form.age} onChange={updateField} type="number" className="w-full p-2 border rounded mb-3" />
            ) : (
              <div className="w-full p-2 mb-3 text-gray-700">{form.age || '-'}</div>
            )}
          </div>
          <div>
            <label className="block text-sm">Weight</label>
            {editing ? (
              <input name="weight" value={form.weight} onChange={updateField} type="number" className="w-full p-2 border rounded mb-3" />
            ) : (
              <div className="w-full p-2 mb-3 text-gray-700">{form.weight || '-'}</div>
            )}
          </div>
        </div>

        <label className="block text-sm">Allergies</label>
        {editing ? (
          <textarea name="allergies" value={form.allergies} onChange={updateField} className="w-full p-2 border rounded mb-3" />
        ) : (
          <div className="w-full p-2 mb-3 text-gray-700">{form.allergies || '-'}</div>
        )}

        <label className="block text-sm">Medications</label>
        {editing ? (
          <textarea name="medications" value={form.medications} onChange={updateField} className="w-full p-2 border rounded mb-3" />
        ) : (
          <div className="w-full p-2 mb-3 text-gray-700">{form.medications || '-'}</div>
        )}

        <label className="flex items-center gap-2 mb-4">
          {editing ? (
            <input type="checkbox" name="consent" checked={form.consent} onChange={updateField} />
          ) : (
            <input type="checkbox" disabled checked={form.consent} />
          )}
          <span className="text-sm">I agree to share my data for medical analysis</span>
        </label>

        {/* hidden save button for form-submit when using the Save in header */}
        <button type="submit" style={{ display: 'none' }} />
      </form>
    </div>
  );
}
