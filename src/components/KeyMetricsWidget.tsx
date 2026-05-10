'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { CheckCircle2, ListTodo, Activity, FolderKanban } from 'lucide-react';

export default function KeyMetricsWidget() {
  const [mounted, setMounted] = useState(false);
  const lists = useTaskStore((state) => state.lists);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-48 glass rounded-2xl animate-pulse"></div>;
  }

  // Calculate metrics across all lists
  let totalTasks = 0;
  let completedTasks = 0;
  let activeProjects = Object.keys(lists).length;

  Object.values(lists).forEach(taskList => {
    totalTasks += taskList.length;
    completedTasks += taskList.filter(t => t.status === 'done').length;
  });

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between group hover:bg-white/10 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ListTodo className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight">{totalTasks}</div>
          <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Total Tasks</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between group hover:bg-white/10 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight">{completedTasks}</div>
          <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Completed</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between group hover:bg-white/10 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight">{completionRate}%</div>
          <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Completion Rate</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between group hover:bg-white/10 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FolderKanban className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight">{activeProjects}</div>
          <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Active Lists</div>
        </div>
      </div>
    </div>
  );
}
