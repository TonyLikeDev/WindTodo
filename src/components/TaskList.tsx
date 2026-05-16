'use client';

import { useState } from 'react';
import GlassCard from './GlassCard';
import { getTasks, createTask, deleteTask, updateTask } from '@/app/actions/taskActions';
import useSWR from 'swr';
import { Check, Plus, Trash2 } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  listId: string;
  userId: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt: Date;
};

export default function TaskList({ title, listId, placeholder, bgColor, hideInput = false }: { title: string, listId: string, placeholder: string, bgColor?: string, hideInput?: boolean }) {
  const [inputValue, setInputValue] = useState('');
  
  const { data: tasks = [], mutate, isLoading } = useSWR<Task[]>(listId, getTasks, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  const handleAddTask = async () => {
    if (inputValue.trim()) {
      const newTitle = inputValue.trim();
      setInputValue('');
      
      const optimistic: Task = { 
        id: `temp-${Date.now()}`, 
        title: newTitle, 
        listId, 
        userId: 'temp', 
        status: 'TODO',
        createdAt: new Date() 
      };
      
      mutate([...tasks, optimistic], false);
      await createTask(newTitle, listId);
      mutate();
    }
  };

  const updateStatus = async (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    mutate(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t), false);
    await updateTask(taskId, { status: newStatus });
    mutate();
  };

  const handleRemoveTask = async (id: string) => {
    mutate(tasks.filter(task => task.id !== id), false);
    await deleteTask(id);
    mutate();
  };

  if (isLoading) {
    return (
      <GlassCard className="flex flex-col h-full min-h-[300px] animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="w-24 h-4 bg-white/10 rounded"></div>
          <div className="w-6 h-4 bg-white/10 rounded-full"></div>
        </div>
        <div className="space-y-3 flex-grow">
          <div className="w-full h-12 bg-white/5 rounded-lg"></div>
          <div className="w-full h-12 bg-white/5 rounded-lg"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="flex flex-col h-full transition-all duration-300 group/list" style={bgColor ? { background: bgColor } : undefined}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {title}
        </h3>
        <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full font-bold">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-grow space-y-2 mb-6 overflow-y-auto max-h-[400px] custom-scrollbar pr-1">
        {tasks.map(task => (
          <div key={task.id} className={`bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between group transition-all hover:bg-white/10 ${task.status === 'DONE' ? 'opacity-50' : 'opacity-100'} ${task.id.startsWith('temp-') ? 'animate-pulse' : ''}`}>
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <span className={`text-sm truncate ${task.status === 'DONE' ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                {task.title}
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE')}
                  className={`text-[9px] font-bold uppercase tracking-wider rounded-md px-1.5 py-0.5 border transition-all cursor-pointer outline-none ${
                    task.status === 'DONE' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    task.status === 'IN_PROGRESS' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    'bg-gray-500/10 border-gray-500/20 text-gray-400'
                  }`}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
            <button 
              onClick={() => handleRemoveTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-sm text-gray-600 py-12 italic bg-white/[0.02] rounded-2xl border border-dashed border-white/5">
            No tasks found.
          </div>
        )}
      </div>

      {!hideInput && (
        <div className="mt-auto relative group-focus-within/list:ring-2 ring-white/10 rounded-xl transition-all">
          <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-gray-200 placeholder-gray-500 focus:outline-none transition-all"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
          />
          <button 
            onClick={handleAddTask}
            className="absolute right-2 top-2 p-1.5 bg-white/5 hover:bg-white text-gray-400 hover:text-black rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}
    </GlassCard>
  );
}
