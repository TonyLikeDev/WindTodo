'use client';

import { useEffect, useState } from 'react';
import { Layers, CheckCircle, Clock, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  totalProjects: number;
  todoTasks: number;
}

export default function WelcomeWidget({ userName, stats }: { userName: string, stats: DashboardStats }) {
  const [greeting] = useState(() => {
    const hours = new Date().getHours();
    if (hours >= 12 && hours < 17) return 'Good Afternoon';
    if (hours >= 17) return 'Good Evening';
    return 'Good Morning';
  });
  const [time, setTime] = useState('');
  
  const completionRate = stats?.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  useEffect(() => {
    const updateTime = () => {

      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden glass rounded-[2.5rem] p-10 border border-white/10 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.02] shadow-2xl">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
              {greeting},<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
                {userName}
              </span>
            </h1>
          </div>
          
          <p className="text-gray-400 text-base max-w-md leading-relaxed font-medium">
            Your workspace is looking great! You&apos;ve completed <span className="text-white font-bold">{completionRate}%</span> of your total tasks so far. Keep the momentum going!
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button className="px-6 py-3 bg-white text-black rounded-2xl text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Continue Working
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-green-400">
              <TrendingUp className="w-4 h-4" />
              +12% productivity
            </div>
          </div>
        </div>

        <div className="relative flex-shrink-0 group">
          {/* Progress Circle */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-white/[0.03]"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={552.92}
                strokeDashoffset={552.92 - (552.92 * completionRate) / 100}
                strokeLinecap="round"
                className="text-white transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white tracking-tighter">{completionRate}%</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Progress</span>
            </div>
          </div>
          
          {/* Time Display floating */}
          <div className="absolute -bottom-2 -right-2 glass px-4 py-2 rounded-2xl border border-white/10 shadow-xl group-hover:-translate-y-1 transition-transform">
            <span className="text-xl font-black text-white tracking-tight">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OverviewKPI({ stats }: { stats: DashboardStats }) {

  const items = [
    { 
      label: 'Active Projects', 
      value: stats?.totalProjects || 0, 
      icon: <Layers className="w-6 h-6" />, 
      color: 'from-blue-500 to-cyan-400',
      shadow: 'shadow-blue-500/20'
    },
    { 
      label: 'Remaining Tasks', 
      value: stats?.todoTasks || 0, 
      icon: <Clock className="w-6 h-6" />, 
      color: 'from-purple-500 to-pink-400',
      shadow: 'shadow-purple-500/20'
    },
    { 
      label: 'Total Completed', 
      value: stats?.completedTasks || 0, 
      icon: <CheckCircle className="w-6 h-6" />, 
      color: 'from-green-500 to-emerald-400',
      shadow: 'shadow-green-500/20'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <div key={i} className="group relative overflow-hidden glass rounded-3xl p-8 border border-white/5 hover:border-white/20 transition-all duration-500">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-[0.03] blur-2xl group-hover:opacity-[0.08] transition-opacity`} />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg ${item.shadow} group-hover:scale-110 transition-transform duration-500`}>
                {item.icon}
              </div>
              <div>
                <p className="text-4xl font-black text-white tracking-tighter mb-1">{item.value}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
                  <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
