'use client';

import GlassCard from './GlassCard';
import { useTaskStore } from '../store/useTaskStore';
import { useEffect, useState } from 'react';
import { AlertCircle, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

const PRIORITIES = [
  { id: 'urgent', label: 'Urgent', icon: AlertCircle, color: 'bg-red-500', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]', text: 'text-red-400', border: 'border-red-500/30' },
  { id: 'high',   label: 'High',   icon: ArrowUp,      color: 'bg-orange-400', glow: 'shadow-[0_0_12px_rgba(251,146,60,0.5)]', text: 'text-orange-400', border: 'border-orange-400/30' },
  { id: 'medium', label: 'Medium', icon: ArrowRight,   color: 'bg-gray-400',   glow: '',                                       text: 'text-gray-400',   border: 'border-gray-400/20' },
  { id: 'low',    label: 'Low',    icon: ArrowDown,    color: 'bg-blue-400',   glow: 'shadow-[0_0_12px_rgba(96,165,250,0.4)]', text: 'text-blue-400',   border: 'border-blue-400/30' },
];

export default function PriorityBreakdown() {
  const [mounted, setMounted] = useState(false);
  const lists = useTaskStore(state => state.lists);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <GlassCard className="animate-pulse h-64" />;
  }

  const allTasks = Object.values(lists).flat().filter(t => t.status !== 'done');
  const total = allTasks.length || 1;

  const counts = PRIORITIES.map(p => ({
    ...p,
    count: allTasks.filter(t => t.priority === p.id).length,
  }));

  const maxCount = Math.max(...counts.map(c => c.count), 1);

  return (
    <GlassCard className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Priority Breakdown
        </h3>
        <span className="text-xs text-gray-500">{allTasks.length} active tasks</span>
      </div>

      <div className="flex flex-col gap-5 flex-grow justify-center">
        {counts.map((p) => {
          const Icon = p.icon;
          const widthPct = Math.round((p.count / maxCount) * 100);
          const sharePct = Math.round((p.count / total) * 100);
          return (
            <div key={p.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className={`flex items-center gap-1.5 font-semibold ${p.text}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {p.label}
                </div>
                <span className="text-gray-400 font-mono">
                  {p.count} <span className="text-gray-600 font-normal">({sharePct}%)</span>
                </span>
              </div>
              <div className={`h-2 w-full bg-white/5 rounded-full border ${p.border} overflow-hidden`}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${p.color} ${p.glow}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
