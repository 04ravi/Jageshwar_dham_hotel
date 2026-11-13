'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHotel } from '@/context/HotelContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useHotel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(email, password);
    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid admin credentials. Please use the demo credentials provided below.');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@jageshwar.com');
    setPassword('jageshwar2026');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between selection:bg-amber-100 selection:text-emerald-950">
      
      {/* HEADER */}
      <header className="px-6 py-4 border-b border-[#EAE5DE] bg-white flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌲</span>
          <span className="font-serif font-bold text-stone-900 text-lg">Jageshwar Dham Retreat</span>
        </Link>
        <Link href="/" className="text-xs font-semibold text-[#0B2B20] hover:underline">
          ← Back to Guest Website
        </Link>
      </header>

      {/* LOGIN CARD */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="luxury-card w-full max-w-md p-8 rounded-3xl bg-white border border-[#EAE5DE] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#0B2B20] text-white text-2xl flex items-center justify-center mx-auto shadow-md">
              🏨
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#0B2B20]">Hotel Management Portal</h2>
            <p className="text-xs text-stone-500">Sign in to access Front Desk, Room Inventory, and Cab Dispatch</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200 text-xs font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Staff / Manager Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jageshwar.com"
                className="w-full p-3 border border-stone-300 rounded-xl bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0B2B20] text-sm font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 border border-stone-300 rounded-xl bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0B2B20] text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0B2B20] hover:bg-[#164E3D] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 hover:shadow-xl text-sm"
            >
              <span>Sign In to PMS Dashboard →</span>
            </button>
          </form>

          {/* DEMO CREDENTIALS BOX */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs space-y-2 text-amber-950">
            <div className="flex justify-between items-center">
              <span className="font-bold">🔑 Demo Access Credentials:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] bg-amber-200 hover:bg-amber-300 font-bold px-2 py-0.5 rounded text-amber-900 transition"
              >
                Auto-Fill
              </button>
            </div>
            <div className="space-y-0.5 font-mono text-[11px] text-amber-900">
              <p>Email: <strong>admin@jageshwar.com</strong></p>
              <p>Password: <strong>jageshwar2026</strong></p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-4 text-xs text-stone-400">
        Jageshwar Dham Retreat PMS v2.0 • Secured Hotel Operations
      </footer>
    </div>
  );
}
