'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { CheckCircle2, ListTodo, Activity, AlertTriangle } from 'lucide-react';
import { isTaskOverdue } from '../utils/dateUtils';

function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
}

interface MetricCardProps {
  label: string;
  value: number;
  maxValue: number;
  icon: React.ReactNode;
  iconBg: string;
  barColor: string;
  suffix?: string;
}

function MetricCard({ label, value, maxValue, icon, iconBg, barColor, suffix = '' }: MetricCardProps) {
  const count = useCountUp(value);
  const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;

  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between group hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${iconBg}`}>
          {icon}
        </div>
        <span className="text-[10px] font-semibold text-gray-600 uppercase">{pct}%</span>
      </div>
      <div>
        <div className="text-2xl font-bold text-white tracking-tight">{count}{suffix}</div>
        <div className="text-xs text-gray-500 uppercase font-semibold mt-1 mb-3">{label}</div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function KeyMetricsWidget() {
  const [mounted, setMounted] = useState(false);
  const lists = useTaskStore(state => state.lists);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-36 glass rounded-2xl animate-pulse" />)}</div>;
  }

  const allTasks = Object.values(lists).flat();
  const total = allTasks.length;
  const completed = allTasks.filter(t => t.status === 'done').length;
  const inProgress = allTasks.filter(t => t.status === 'in-progress').length;
  const overdue = allTasks.filter(t => t.status !== 'done' && isTaskOverdue(t.dueDate || t.time)).length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard
        label="Total Tasks"
        value={total}
        maxValue={total}
        icon={<ListTodo className="w-4 h-4" />}
        iconBg="bg-accent-500/20 text-accent-400"
        barColor="bg-accent-500"
      />
      <MetricCard
        label="Completed"
        value={completed}
        maxValue={total}
        icon={<CheckCircle2 className="w-4 h-4" />}
        iconBg="bg-green-500/20 text-green-400"
        barColor="bg-green-500"
      />
      <MetricCard
        label="Completion Rate"
        value={completionRate}
        maxValue={100}
        icon={<Activity className="w-4 h-4" />}
        iconBg="bg-purple-500/20 text-purple-400"
        barColor="bg-purple-500"
        suffix="%"
      />
      <MetricCard
        label="Overdue"
        value={overdue}
        maxValue={Math.max(total, 1)}
        icon={<AlertTriangle className="w-4 h-4" />}
        iconBg={overdue > 0 ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400"}
        barColor={overdue > 0 ? "bg-red-500" : "bg-gray-500"}
      />
      {inProgress > 0 && (
        <div className="col-span-2 bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase font-semibold">In Progress</span>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.round((inProgress / total) * 100)}%` }}
              />
            </div>
            <span className="text-sm font-bold text-yellow-400">{inProgress}</span>
          </div>
        </div>
      )}
    </div>
  );
}
