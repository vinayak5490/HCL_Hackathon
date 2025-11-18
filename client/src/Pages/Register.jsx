import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({ name:'', email:'', password:'', age:'', weight:'', allergies:'', medications:'', consent:false });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { ...form });
      alert('Registered! Please login.');
      nav('/login');
    } catch (err) {
      setErr(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register (Patient)</h2>
      {err && <div style={{color:'red'}}>{err}</div>}
      <form onSubmit={submit}>
        <input name="name" placeholder="Name" onChange={onChange} required /><br/>
        <input name="email" placeholder="Email" onChange={onChange} type="email" required /><br/>
        <input name="password" placeholder="Password" onChange={onChange} type="password" required /><br/>
        <input name="age" placeholder="Age" onChange={onChange} type="number" /><br/>
        <input name="weight" placeholder="Weight (kg)" onChange={onChange} type="number" /><br/>
        <input name="allergies" placeholder="Allergies" onChange={onChange} /><br/>
        <input name="medications" placeholder="Medications" onChange={onChange} /><br/>
        <label><input name="consent" type="checkbox" onChange={onChange} /> I consent to data usage</label><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
