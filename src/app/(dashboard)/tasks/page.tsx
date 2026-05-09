'use client';

import { useState } from 'react';
import TaskList from '@/components/TaskList';
import Timeline, { TimelineEvent } from '@/components/Timeline';
import KanbanBoard from '@/components/KanbanBoard';
import { Task } from '@/types';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  const allTasks: Task[] = [
    { id: '1', title: 'Morning standup meeting', time: '09:00', status: 'todo' },
    { id: '2', title: 'Review pull requests', status: 'in-progress' },
    { id: '3', title: 'Update documentation', status: 'todo' },
    { id: '4', title: 'WindTodo V1', time: 'Tomorrow', status: 'todo' },
    { id: '5', title: 'Project Phoenix', status: 'todo' },
    { id: '6', title: 'Design system review', status: 'todo' },
    { id: '7', title: 'API Integration', status: 'done' },
  ];

  const dailySchedule: TimelineEvent[] = [
    { id: 't1', time: '09:00 AM', title: 'Morning Standup', description: 'Sync with the engineering team.' },
    { id: 't2', time: '11:00 AM', title: 'Design Review', description: 'Review the new dashboard mockups with the design team.', isActive: true },
    { id: 't3', time: '01:00 PM', title: 'Lunch Break' },
    { id: 't4', time: '02:30 PM', title: 'Client Meeting', description: 'Discuss Q3 deliverables.' },
    { id: 't5', time: '05:00 PM', title: 'Daily Wrap-up', description: 'Update issue tracker and plan for tomorrow.' },
    { id: 't6', time: '07:00 PM', title: 'Dinner & Relax', description: 'Personal time.' },
    { id: 't7', time: '09:00 PM', title: 'Reading / Learning', description: 'Read a few chapters of the new design book.' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Tasks</h1>
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            List View
          </button>
          <button 
            onClick={() => setViewMode('board')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'board' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            Board View
          </button>
        </div>
      </div>
      
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[600px]">
            <TaskList 
              listId="tasks-all"
              title="All Tasks" 
              initialTasks={allTasks} 
              placeholder="Add a new task..." 
            />
          </div>
          <div className="h-[600px]">
            <Timeline 
              title="Today's Schedule" 
              events={dailySchedule} 
            />
          </div>
        </div>
      ) : (
        <KanbanBoard listId="tasks-all" initialTasks={allTasks} />
      )}
    </div>
  );
}
