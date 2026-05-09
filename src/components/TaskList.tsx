'use client';

import { useState } from 'react';
import GlassCard from './GlassCard';
import { getTasks, createTask, deleteTask } from '@/app/actions/taskActions';
import useSWR from 'swr';

type Task = {
  id: string;
  title: string;
  listId: string;
  userId: string;
  createdAt: Date;
};

export default function TaskList({ title, listId, placeholder }: { title: string, listId: string, placeholder: string }) {
  const [inputValue, setInputValue] = useState('');
  
  // SWR automatically handles fetching, caching, and revalidation
  const { data: tasks = [], mutate, isLoading } = useSWR<Task[]>(listId, getTasks);

  const handleAddTask = async () => {
    if (inputValue.trim()) {
      const newTitle = inputValue.trim();
      setInputValue('');
      
      // Optimistic update: instantly show the task in the UI before the server responds
      const optimisticTask = { 
        id: `temp-${Date.now()}`, 
        title: newTitle, 
        listId, 
        userId: 'temp', 
        createdAt: new Date() 
      };
      
      mutate([...tasks, optimisticTask], false);

      await createTask(newTitle, listId);
      mutate(); // Re-fetch the actual data from the server
    }
  };

  const handleRemoveTask = async (id: string) => {
    // Optimistic update: instantly remove the task from the UI
    mutate(tasks.filter(task => task.id !== id), false);
    
    await deleteTask(id);
    mutate(); // Re-fetch the actual data from the server
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
        <div className="w-full h-10 bg-white/10 rounded-lg mt-6"></div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="flex flex-col h-full transition-opacity duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-grow space-y-3 mb-6 overflow-y-auto max-h-64 custom-scrollbar">
        {tasks.map(task => (
          <div key={task.id} className={`bg-white/5 border border-white/5 p-3 rounded-lg flex items-center justify-between group transition-all hover:bg-white/10 ${task.id.startsWith('temp-') ? 'opacity-50' : 'opacity-100'}`}>
            <span className="text-sm">{task.title}</span>
            <button 
              onClick={() => handleRemoveTask(task.id)}
              className="text-gray-600 group-hover:text-gray-400 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-4">No tasks yet.</div>
        )}
      </div>
      <div className="mt-auto relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 pl-4 pr-12 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all disabled:opacity-50"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
        />
        <button 
          onClick={handleAddTask}
          className="absolute right-2 top-1.5 p-1 text-gray-500 hover:text-white transition-colors disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
      </div>
    </GlassCard>
  );
}
