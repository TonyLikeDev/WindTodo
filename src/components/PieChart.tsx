'use client';

import GlassCard from './GlassCard';
import { useTaskStore } from '../store/useTaskStore';
import { useEffect, useState } from 'react';

export default function PieChart() {
  const [mounted, setMounted] = useState(false);
  const lists = useTaskStore(state => state.lists);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <GlassCard className="h-64 animate-pulse" />;
  }

  const allTasks = Object.values(lists).flat();
  const total = allTasks.length;
  const done = allTasks.filter(t => t.status === 'done').length;
  const inProgress = allTasks.filter(t => t.status === 'in-progress').length;
  const todo = allTasks.filter(t => t.status === 'todo' || !t.status).length;

  const donePercent = total === 0 ? 0 : (done / total) * 100;
  const inProgressPercent = total === 0 ? 0 : (inProgress / total) * 100;
  const todoPercent = total === 0 ? 0 : (todo / total) * 100;

  const SEGMENTS = [
    { label: 'Done', count: done, percent: donePercent, color: '#00ffcc', shadowColor: 'rgba(0,255,204,0.6)', offset: 0 },
    { label: 'In Progress', count: inProgress, percent: inProgressPercent, color: '#ffee00', shadowColor: 'rgba(255,238,0,0.6)', offset: donePercent },
    { label: 'Pending', count: todo, percent: todoPercent, color: '#ff0055', shadowColor: 'rgba(255,0,85,0.6)', offset: donePercent + inProgressPercent },
  ];

  return (
    <GlassCard className="flex flex-col items-center">
      <h3 className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider self-start">
        Task Distribution
      </h3>

      <div className="relative w-44 h-44 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 overflow-visible">
          {/* Background */}
          <circle cx="18" cy="18" r="16" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          {/* Segments */}
          {SEGMENTS.map(seg => (
            <circle
              key={seg.label}
              cx="18" cy="18" r="16"
              fill="transparent"
              stroke={seg.color}
              strokeWidth="4"
              strokeDasharray={`${seg.percent} 100`}
              strokeDashoffset={`-${seg.offset}`}
              strokeLinecap="round"
              pathLength="100"
              style={{
                filter: `drop-shadow(0 0 3px ${seg.shadowColor})`,
                transition: 'stroke-dasharray 1s ease-out, stroke-dashoffset 1s ease-out',
              }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
            {Math.round(donePercent)}%
          </span>
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Complete</span>
        </div>
      </div>

      {/* Legend with counts */}
      <div className="mt-8 w-full space-y-2.5">
        {SEGMENTS.map(seg => (
          <div key={seg.label} className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color, boxShadow: `0 0 6px ${seg.shadowColor}` }} />
              <span className="text-sm text-gray-300">{seg.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${seg.percent}%`, backgroundColor: seg.color }} />
              </div>
              <span className="text-xs font-mono text-gray-400 w-12 text-right">
                {seg.count} <span className="text-gray-600">({Math.round(seg.percent)}%)</span>
              </span>
            </div>
          </div>
        ))}

        {total === 0 && (
          <p className="text-center text-gray-600 text-sm mt-4">No tasks yet</p>
        )}
      </div>
    </GlassCard>
  );
}
