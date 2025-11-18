import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Register(){
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name:'', email:'', password:'', age:'', weight:'', allergies:'', medications:'', consent:false, role: 'patient', assignedProvider: '' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setOk('');
    const res = await register(form);
    if (!res.ok) setErr(res.error || 'Registration failed');
    else setOk('Registered successfully — please login');
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create your account</h2>
      {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
      {ok && <div className="text-sm text-green-600 mb-2">{ok}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input name="name" placeholder="Full name" onChange={onChange} required className="w-full border p-2 rounded" />
        <input name="email" placeholder="Email" onChange={onChange} type="email" required className="w-full border p-2 rounded" />
        <input name="password" placeholder="Password" onChange={onChange} type="password" required className="w-full border p-2 rounded" />
        <div className="grid grid-cols-2 gap-2">
          <input name="age" placeholder="Age" onChange={onChange} type="number" className="w-full border p-2 rounded" />
          <input name="weight" placeholder="Weight (kg)" onChange={onChange} type="number" className="w-full border p-2 rounded" />
        </div>
        <input name="allergies" placeholder="Allergies" onChange={onChange} className="w-full border p-2 rounded" />
        <input name="medications" placeholder="Medications" onChange={onChange} className="w-full border p-2 rounded" />
        <label className="inline-flex items-center">
          <input name="consent" type="checkbox" onChange={onChange} className="mr-2" />
          <span className="text-sm">I consent to data usage</span>
        </label>

        <div className="mt-2">
          <label className="block text-sm mb-1">I am a</label>
          <select name="role" value={form.role} onChange={onChange} className="border p-2 rounded w-full">
            <option value="patient">Patient</option>
            <option value="provider">Healthcare Provider</option>
          </select>
        </div>

        {form.role === 'patient' && (
          <input name="assignedProvider" placeholder="Provider ID (optional)" onChange={onChange} className="w-full border p-2 rounded" />
        )}
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Register</button>
        </div>
      </form>
    </div>
  );
}
