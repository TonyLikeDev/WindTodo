'use client';

import GlassCard from './GlassCard';
import { useTaskStore } from '../store/useTaskStore';
import { useEffect, useState } from 'react';

function getLast7Days() {
  const days: { label: string; dateStr: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateStr: d.toISOString().split('T')[0],
    });
  }
  return days;
}

export default function CompletionTrend() {
  const [mounted, setMounted] = useState(false);
  const lists = useTaskStore(state => state.lists);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <GlassCard className="animate-pulse h-56" />;
  }

  const allTasks = Object.values(lists).flat();
  const days = getLast7Days();

  const data = days.map(day => ({
    label: day.label,
    created: allTasks.filter(t => (t.createdAt || '').startsWith(day.dateStr)).length,
    done: allTasks.filter(
      t => t.status === 'done' && ((t.dueDate || t.time || '') !== '' ? (t.dueDate || t.time || '').startsWith(day.dateStr) : false)
    ).length,
  }));

  const maxVal = Math.max(...data.flatMap(d => [d.created, d.done]), 1);

  // SVG chart dimensions
  const W = 400;
  const H = 120;
  const PAD = { top: 10, right: 10, bottom: 10, left: 10 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const stepX = chartW / (data.length - 1);

  const toPoint = (val: number, idx: number) =>
    `${PAD.left + idx * stepX},${PAD.top + chartH - (val / maxVal) * chartH}`;

  const createdPoints = data.map((d, i) => toPoint(d.created, i)).join(' ');
  const donePoints = data.map((d, i) => toPoint(d.done, i)).join(' ');

  const areaCreated = `M ${toPoint(0, 0)} ${data.slice(1).map((d, i) => `L ${toPoint(d.created, i + 1)}`).join(' ')} L ${PAD.left + (data.length - 1) * stepX},${PAD.top + chartH} L ${PAD.left},${PAD.top + chartH} Z`;
  const areaDone = `M ${toPoint(data[0].done, 0)} ${data.slice(1).map((d, i) => `L ${toPoint(d.done, i + 1)}`).join(' ')} L ${PAD.left + (data.length - 1) * stepX},${PAD.top + chartH} L ${PAD.left},${PAD.top + chartH} Z`;

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Activity Trend — Last 7 Days
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-3 h-0.5 bg-accent-400 inline-block rounded-full" />
            Created
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-3 h-0.5 bg-green-400 inline-block rounded-full" />
            Done
          </span>
        </div>
      </div>

      <div className="w-full">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-400)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent-400)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fills */}
          <path d={areaCreated} fill="url(#gradCreated)" />
          <path d={areaDone} fill="url(#gradDone)" />

          {/* Lines */}
          <polyline points={createdPoints} fill="none" stroke="var(--accent-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={donePoints} fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={PAD.left + i * stepX} cy={PAD.top + chartH - (d.created / maxVal) * chartH} r="3" fill="var(--accent-400)" />
              <circle cx={PAD.left + i * stepX} cy={PAD.top + chartH - (d.done / maxVal) * chartH} r="3" fill="#4ade80" />
            </g>
          ))}
        </svg>

        {/* Day labels */}
        <div className="flex justify-between px-2 mt-1">
          {data.map((d, i) => (
            <span key={i} className="text-[10px] text-gray-600 uppercase">{d.label}</span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
