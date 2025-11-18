import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Wellness • Goals • Care</div>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Track habits, share progress with your provider, feel better.</h1>
          <p className="mt-4 text-gray-600 max-w-xl">Daily goal tracking, simple progress visualizations, and secure provider collaboration — all in one friendly app.</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700">Sign in</Link>
            <Link to="/signup" className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50">Create account</Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold">Daily Goals</div>
              <div className="text-xs text-gray-500 mt-2">Quickly set and update goals for steps, water and sleep.</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold">Provider Collaboration</div>
              <div className="text-xs text-gray-500 mt-2">Share progress with your care team and get personalised advice.</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold">Privacy + Consent</div>
              <div className="text-xs text-gray-500 mt-2">You control what you share. Consent is requested during signup.</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="w-full h-[420px] bg-gradient-to-tr from-indigo-500 to-rose-400 rounded-2xl shadow-xl flex items-center justify-center text-white">
            <div className="p-8 text-center">
              <div className="text-6xl font-black">💪</div>
              <div className="mt-4 text-lg font-semibold">Small steps, big impact</div>
              <div className="mt-2 text-sm">Track habits, celebrate wins, and stay connected with care.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
