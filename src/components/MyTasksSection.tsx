'use client';

import React from 'react';
import useSWR from 'swr';
import { getMyTasks } from '@/app/actions/taskActions';
import GlassCard from './GlassCard';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MyTasksSection() {
  const { data: tasks = [], isLoading } = useSWR('my-tasks', getMyTasks, {
    revalidateOnFocus: false,
    dedupingInterval: 10000
  });

  if (isLoading) {
    return (
      <GlassCard className="h-full min-h-[400px] animate-pulse">
        <div className="h-6 w-32 bg-white/10 rounded mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-white/5 rounded-xl" />)}
        </div>
      </GlassCard>
    );
  }

  const completed = tasks.filter(t => t.status === 'DONE');
  const active = tasks.filter(t => t.status !== 'DONE');

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Your Tasks</h3>
          <p className="text-xs text-gray-500">Tasks assigned specifically to you</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">
            {active.length} ACTIVE
          </span>
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar flex-1">
        {active.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">All caught up!</p>
            <p className="text-gray-600 text-xs">No active tasks assigned to you.</p>
          </div>
        )}

        {active.map(task => (
          <Link 
            key={task.id} 
            href={`/projects/${task.list.project.id}`}
            className="block group"
          >
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300">
              <div className="flex-shrink-0">
                {task.status === 'IN_PROGRESS' ? (
                  <Clock className="w-5 h-5 text-blue-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">Project:</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase truncate" style={{ color: task.list.project.color }}>
                    {task.list.project.name}
                  </span>
                  <span className="text-gray-700">|</span>
                  <span className="text-[9px] text-gray-500">{task.list.name}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}

        {completed.length > 0 && (
          <div className="mt-8">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 pl-1">Recently Completed</p>
            <div className="space-y-2 opacity-60">
              {completed.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 line-through decoration-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500/50" />
                  <span className="text-xs text-gray-500 truncate">{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
