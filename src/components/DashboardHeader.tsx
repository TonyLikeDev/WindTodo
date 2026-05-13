'use client';

import React, { useEffect, useState } from 'react';
import { syncUser } from '@/app/actions/userActions';
import { Sparkles, Calendar, Zap } from 'lucide-react';

export default function DashboardHeader() {
  const [user, setUser] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const [today, setToday] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    syncUser().then(setUser);
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const dateStr = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    setToday(dateStr);
  }, []);

  if (!mounted) return (
    <div className="h-32 w-full rounded-3xl bg-white/[0.05] border border-white/5 animate-pulse mb-8" />
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 p-8 mb-8">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Dashboard Control Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{user?.name || user?.email?.split('@')[0] || 'Member'}</span>
          </h1>
          <p className="text-gray-400 mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            {today}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="glass px-6 py-4 rounded-2xl border border-white/5 flex flex-col items-center">
            <Zap className="w-5 h-5 text-yellow-500 mb-1" />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Productivity</span>
            <span className="text-xl font-bold text-white">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
