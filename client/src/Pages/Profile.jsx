import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api, authHeader } from '../services/api';

export default function Profile(){
  const { token, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!token) return;
    api.get('/goals', authHeader(token)).then(() => {}).catch(()=>{});
    // Fetch user profile (simple approach: stored in localStorage). If you have an endpoint, call it here.
    setProfile({ name: user?.name, email: user?.email });
  }, [token]);

  const onSave = async (e) => {
    e.preventDefault();
    setMsg('Profile update not implemented in this MVP.');
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={onSave}>
        <input defaultValue={profile?.name} /><br/>
        <input defaultValue={profile?.email} disabled /><br/>
        <button>Save (stub)</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
