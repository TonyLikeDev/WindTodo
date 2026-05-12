'use client';

import { useEffect, useState } from 'react';
import GlassCard from './GlassCard';
import { useTaskBoard } from '../hooks/useTaskBoard';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { isTaskOverdue } from '../utils/dateUtils';

export default function WelcomeWidget() {
  const [tasks] = useTaskBoard('dashboard-daily', []);
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState({ text: 'Good morning', icon: '☀️' });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting({ text: 'Good morning', icon: '☀️' });
    } else if (hour >= 12 && hour < 14) {
      setGreeting({ text: 'Good lunch', icon: '🍱' });
    } else if (hour >= 14 && hour < 18) {
      setGreeting({ text: 'Good afternoon', icon: '🌤️' });
    } else if (hour >= 18 && hour < 22) {
      setGreeting({ text: 'Good evening', icon: '🌙' });
    } else {
      setGreeting({ text: 'Good night', icon: '😴' });
    }
    setMounted(true);
  }, []);

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  
  const overdue = tasks.filter(t => t.status !== 'done' && isTaskOverdue(t.time)).length;
  const pending = total - done - overdue;

  if (!mounted) return null;

  return (
    <GlassCard className="mb-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            {greeting.text}! {greeting.icon}
          </h1>
          <p className="text-gray-400">Here&apos;s a quick overview of your day.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 pr-6">
            <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold">Completed</div>
              <div className="text-lg font-bold text-white">{done}/{total}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 pr-6">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold">Pending</div>
              <div className="text-lg font-bold text-white">{pending}</div>
            </div>
          </div>
          
          {overdue > 0 && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 pr-6">
              <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-red-400/70 uppercase font-semibold">Overdue</div>
                <div className="text-lg font-bold text-red-400">{overdue}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
