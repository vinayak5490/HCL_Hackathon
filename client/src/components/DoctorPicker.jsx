import React, { useEffect, useState } from 'react';

export default function DoctorPicker({ onClose, onBooked }){
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [problem, setProblem] = useState('');
  const [slotInput, setSlotInput] = useState(''); // datetime-local value
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // initial load: fetch a small page of doctors
    fetch('/api/doctors?page=1&limit=' + limit)
      .then(r => r.json())
      .then(d => {
        setDoctors(d.doctors || []);
        setTotal(d.total || 0);
        setPage(d.page || 1);
        setLimit(d.limit || limit);
      })
      .catch(() => setDoctors([]));
  }, []);

  async function search(){
    setSearching(true);
    try{
      const params = new URLSearchParams();
      if (problem) params.set('problem', problem);
      if (slotInput) {
        // convert local datetime to ISO
        const iso = new Date(slotInput).toISOString();
        params.set('slot', iso);
      }
      params.set('page', 1);
      params.set('limit', limit);
      const url = `/api/doctors?${params.toString()}`;
      setLoading(true);
      const res = await fetch(url);
      const body = await res.json();
      setDoctors(body.doctors || []);
      setTotal(body.total || 0);
      setPage(body.page || 1);
    }catch(err){
      console.error(err); setDoctors([]);
    }finally{ setLoading(false); setSearching(false); }
  }

  async function goToPage(p){
    setPage(p);
    try{
      const params = new URLSearchParams();
      if (problem) params.set('problem', problem);
      if (slotInput) params.set('slot', new Date(slotInput).toISOString());
      params.set('page', p);
      params.set('limit', limit);
      setLoading(true);
      const res = await fetch('/api/doctors?' + params.toString());
      const body = await res.json();
      setDoctors(body.doctors || []);
      setTotal(body.total || 0);
      setPage(body.page || p);
    }catch(err){ console.error(err); setDoctors([]); }
    finally{ setLoading(false); }
  }

  async function loadSlots(doctorId){
    try{
      const res = await fetch(`/api/doctors/${doctorId}/slots`);
      const body = await res.json();
      return body.slots || [];
    }catch(err){ console.error(err); return []; }
  }

  async function book(doctorId, slotId){
    setBooking(doctorId);
    try{
      const token = localStorage.getItem('token');
      const res = await fetch('/api/doctors/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ doctorId, slotId })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Booking failed'); setBooking(null); return; }
      alert('Appointment booked');
      if (onBooked) onBooked(data.appointment);
      if (onClose) onClose();
    }catch(err){ console.error(err); alert('Booking failed'); }
    finally{ setBooking(null); }
  }

  return (
    <div>
      <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-2">
        <input placeholder="Describe problem (e.g. cardiology, diabetes)" value={problem} onChange={e=>setProblem(e.target.value)} className="p-2 border rounded col-span-2" />
        <input type="datetime-local" value={slotInput} onChange={e=>setSlotInput(e.target.value)} className="p-2 border rounded" />
        <div className="col-span-3 text-right">
          <button onClick={search} disabled={searching} className="px-3 py-1 bg-indigo-600 text-white rounded">{searching ? 'Searching...' : 'Search'}</button>
        </div>
      </div>

      {loading && <div>Loading doctors...</div>}
      {!loading && doctors.length === 0 && <div>No doctors available for the selected filters.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map(d => (
          <DoctorCard key={d._id} doctor={d} booking={booking} book={book} loadSlots={loadSlots} slotInput={slotInput} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">{total} doctors found</div>
        <div className="space-x-2">
          <button disabled={page<=1} onClick={() => goToPage(page-1)} className="px-2 py-1 border rounded">Prev</button>
          <span className="px-2">Page {page} / {Math.max(1, Math.ceil(total/limit))}</span>
          <button disabled={(page*limit) >= total} onClick={() => goToPage(page+1)} className="px-2 py-1 border rounded">Next</button>
        </div>
      </div>

      <div className="mt-3 text-right">
        <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
      </div>
    </div>
  );
}

function DoctorCard({ doctor, booking, book, loadSlots, slotInput }){
  const [slots, setSlots] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    // if server provided nextAvailableSlots (compact), use them. Otherwise fetch later.
    if (doctor.nextAvailableSlots && doctor.nextAvailableSlots.length > 0){
      setSlots(doctor.nextAvailableSlots.slice(0,10));
    }
  }, [doctor]);

  async function showSlots(){
    setLoadingSlots(true);
    const s = await loadSlots(doctor._id);
    setSlots(s.slice(0,30));
    setLoadingSlots(false);
  }

  // If user requested a specific slotInput, prefer to show booking button for that slot if present
  const requestedIso = slotInput ? new Date(slotInput).toISOString() : null;

  return (
    <div className="p-3 border rounded">
      <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img src={doctor.photoUrl || 'https://i.pravatar.cc/48'} alt="doc" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-semibold">{doctor.name} <span className="text-xs text-gray-500">{doctor.specialty}</span></div>
              <div className="text-sm text-gray-500">{doctor.clinic} • {doctor.city}</div>
              <div className="text-xs text-gray-400">{doctor.phone}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-yellow-600 font-medium">⭐ {doctor.rating || 4.5} • {doctor.experienceYears || 5} yrs</div>
            <button onClick={showSlots} className="px-2 py-1 border rounded mt-2">View slots</button>
          </div>
        </div>

      <div className="mt-2">
        {loadingSlots && <div className="text-sm">Loading slots...</div>}
        {slots && slots.length === 0 && <div className="text-sm text-gray-500">No upcoming slots</div>}
        {slots && slots.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {slots.map(s => {
              const startIso = new Date(s.start).toISOString();
              const slotId = s._id || startIso;
              return (
                <div key={slotId} className="p-2 border rounded flex items-center justify-between">
                  <div className="text-sm">{new Date(s.start).toLocaleString()}</div>
                  <div>
                    <button disabled={booking===doctor._id} onClick={() => book(doctor._id, slotId)} className="px-2 py-1 bg-indigo-600 text-white rounded">{booking===doctor._id ? 'Booking...' : 'Book'}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
