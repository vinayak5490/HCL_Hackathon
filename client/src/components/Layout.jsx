import React from 'react';
import Header from './Header';

export default function Layout({ children }){
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="mt-12 py-6 bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 text-sm text-gray-600">© {new Date().getFullYear()} Health Goals — Built with care.</div>
      </footer>
    </div>
  );
}
