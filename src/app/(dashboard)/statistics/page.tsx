'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { isTaskOverdue } from '@/utils/dateUtils';
import PieChart from '@/components/PieChart';
import ActivityGraph from '@/components/ActivityGraph';
import KeyMetricsWidget from '@/components/KeyMetricsWidget';
import PriorityBreakdown from '@/components/PriorityBreakdown';
import CompletionTrend from '@/components/CompletionTrend';
import { ListTodo, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

function HeroStat({ label, value, icon, color, subtext }: { label: string; value: number | string; icon: React.ReactNode; color: string; subtext?: string }) {
  return (
    <div className={`flex items-center gap-4 p-5 rounded-2xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-xs text-gray-500 uppercase font-semibold">{label}</div>
        {subtext && <div className="text-[10px] text-gray-600 mt-0.5">{subtext}</div>}
      </div>
    </div>
  );
}

export default function StatisticsPage() {
  const [mounted, setMounted] = useState(false);
  const lists = useTaskStore(state => state.lists);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allTasks = Object.values(lists).flat();
  const total = allTasks.length;
  const completed = allTasks.filter(t => t.status === 'done').length;
  const inProgress = allTasks.filter(t => t.status === 'in-progress').length;
  const overdue = mounted ? allTasks.filter(t => t.status !== 'done' && isTaskOverdue(t.dueDate || t.time)).length : 0;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Statistics</h1>
          <p className="text-sm text-gray-500 mt-1">
            {mounted ? `${total} tasks tracked across ${Object.keys(lists).length} list${Object.keys(lists).length !== 1 ? 's' : ''}` : 'Loading...'}
          </p>
        </div>
        {rate > 0 && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-green-400">{rate}% Complete</span>
          </div>
        )}
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HeroStat
          label="Total Tasks"
          value={total}
          icon={<ListTodo className="w-6 h-6" />}
          color="bg-accent-500/20 text-accent-400"
          subtext="across all lists"
        />
        <HeroStat
          label="Completed"
          value={completed}
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="bg-green-500/20 text-green-400"
          subtext={`${rate}% of total`}
        />
        <HeroStat
          label="In Progress"
          value={inProgress}
          icon={<Loader2 className="w-6 h-6" />}
          color="bg-yellow-500/20 text-yellow-400"
          subtext="actively working"
        />
        <HeroStat
          label="Overdue"
          value={overdue}
          icon={<AlertTriangle className="w-6 h-6" />}
          color={overdue > 0 ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-500"}
          subtext={overdue > 0 ? "needs attention!" : "all on track 🎉"}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PieChart />
        <PriorityBreakdown />
      </div>

      {/* Metrics + Trend Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <KeyMetricsWidget />
        <CompletionTrend />
      </div>

      {/* Full-width Tags Bar Chart */}
      <ActivityGraph />
    </div>
  );
}
