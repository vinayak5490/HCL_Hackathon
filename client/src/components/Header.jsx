import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header(){
  const { user, logout } = useAuth();
  const nav = useNavigate();

  function handleLogout(){
    logout();
    nav('/');
  }

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-rose-500 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">HG</div>
            <div className="hidden sm:block">
              <div className="font-bold">Health Goals</div>
              <div className="text-xs opacity-90">Wellness • Goals • Care</div>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-sm hover:underline">Home</Link>
          <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
          <Link to="/appointments" className="text-sm hover:underline">Appointments</Link>
          <Link to="/profile" className="text-sm hover:underline">Profile</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex sm:items-center sm:gap-2">
                <div className="text-sm">{user.name || user.email}</div>
                <div className="text-xs text-white/80">{user.role}</div>
              </div>
              <button onClick={handleLogout} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm">Sign out</button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
