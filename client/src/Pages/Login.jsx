import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login(){
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState('');

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const res = await login(form.email, form.password);
    if (!res.ok) setErr(res.error || 'Login failed');
    else nav('/dashboard');
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input name="email" placeholder="Email" onChange={onChange} type="email" required className="w-full border p-2 rounded" />
        <input name="password" placeholder="Password" onChange={onChange} type="password" required className="w-full border p-2 rounded" />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
        </div>
      </form>
    </div>
  );
}
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const res = await login(form.email, form.password);
    if (!res.ok) setErr(res.error || 'Login failed');
    else nav('/dashboard');
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input name="email" placeholder="Email" onChange={onChange} type="email" required className="w-full border p-2 rounded" />
        <input name="password" placeholder="Password" onChange={onChange} type="password" required className="w-full border p-2 rounded" />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
        </div>
      </form>
    </div>
  );
}
