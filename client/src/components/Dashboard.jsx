import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PatientDashboard from "./PatientDashboard";
import ProviderDashboard from "./ProviderDashboard";

const Dashboard = () => {
  const { user, token } = useAuth();

  // No token -> user will be redirected by PrivateRoute, but provide a friendly CTA if reached directly
  if (!token && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome to Health Goals</h1>
          <p className="text-gray-600 mb-6">Track goals, collaborate with providers, and stay on top of wellbeing.</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Sign in</Link>
            <Link to="/signup" className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">Create account</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
              {user.name ? user.name.split(' ').map(n=>n[0]).slice(0,2).join('') : user.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">{user.name || user.email}</div>
              <div className="text-sm text-gray-500">{user.role === 'provider' ? 'Provider' : 'Patient'}</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="text-xs text-gray-500 uppercase">Quick Actions</div>
            <Link to="/" className="block text-sm px-3 py-2 rounded hover:bg-gray-50">Home</Link>
            <Link to="/profile" className="block text-sm px-3 py-2 rounded hover:bg-gray-50">Profile</Link>
            <Link to="/public" className="block text-sm px-3 py-2 rounded hover:bg-gray-50">Public Info</Link>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Good {new Date().getHours() < 12 ? 'morning' : 'day'}, {user.name?.split(' ')[0] || user.email}</h2>
                <p className="text-sm text-gray-500 mt-1">{user.role === 'provider' ? 'Manage your patients and review progress' : 'View and update your daily goals'}</p>
              </div>
            </div>

            <div className="mt-6">
              {user.role === "provider" ? (
                <ProviderDashboard />
              ) : (
                <PatientDashboard />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
