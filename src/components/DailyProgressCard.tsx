'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { isTaskOverdue } from '../utils/dateUtils';
import { Target, TrendingUp, Clock } from 'lucide-react';

export default function DailyProgressCard() {
  const [mounted, setMounted] = useState(false);
  const lists = useTaskStore(state => state.lists);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const allTasks = Object.values(lists).flat();
  const total = allTasks.length;
  const done = allTasks.filter(t => t.status === 'done').length;
  const inProgress = allTasks.filter(t => t.status === 'in-progress').length;
  const overdue = allTasks.filter(t => t.status !== 'done' && isTaskOverdue(t.dueDate || t.time)).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  if (total === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Left: Title + Progress Bar */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-semibold text-white">Overall Progress</span>
            </div>
            <span className="text-lg font-bold text-accent-400">{pct}%</span>
          </div>
          <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_var(--accent-400)]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-gray-500">{done}/{total} tasks done</span>
          </div>
        </div>

        {/* Right: Mini Stats */}
        <div className="flex gap-4 shrink-0">
          {inProgress > 0 && (
            <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-3 py-2 rounded-xl">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{inProgress} active</span>
            </div>
          )}
          {overdue > 0 && (
            <div className="flex items-center gap-1.5 text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-xl">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{overdue} overdue</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
