'use client';

import { useEffect, useState } from 'react';
import GlassCard from './GlassCard';
import { useTaskBoard } from '../hooks/useTaskBoard';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function WelcomeWidget() {
  const [tasks] = useTaskBoard('dashboard-daily', []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  
  // Calculate overdue tasks
  const isOverdue = (timeStr?: string) => {
    if (!timeStr) return false;
    let dateToCompare = new Date();
    const now = new Date();
    if (timeStr.includes('-') && timeStr.includes(':')) {
      dateToCompare = new Date(timeStr.replace(' ', 'T'));
    } else if (timeStr.includes('-')) {
      dateToCompare = new Date(`${timeStr}T23:59:59`);
    } else if (timeStr.includes(':')) {
      const today = now.toISOString().split('T')[0];
      dateToCompare = new Date(`${today}T${timeStr}:00`);
    } else {
      return false; 
    }
    return dateToCompare < now;
  };

  const overdue = tasks.filter(t => t.status !== 'done' && isOverdue(t.time)).length;
  const pending = total - done - overdue;

  if (!mounted) return null;

  return (
    <GlassCard className="mb-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Good morning! ☀️</h1>
          <p className="text-gray-400">Here's a quick overview of your day.</p>
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
