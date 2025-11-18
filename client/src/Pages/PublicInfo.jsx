import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function PublicInfo(){
  const [info, setInfo] = useState(null);
  useEffect(() => {
    api.get('/public/info').then(r => setInfo(r.data)).catch(() => setInfo({ title: 'Public Info', content: 'Offline' }));
  }, []);
  return (
    <div>
      <h1>Healthcare Wellness Portal</h1>
      <p>{info?.content}</p>
    </div>
  );
}
