'use client';

import { useState, useEffect } from 'react';
import GlassCard from './GlassCard';

type Task = {
  id: string;
  title: string;
};

export default function TaskList({ title, initialTasks, placeholder }: { title: string, initialTasks: Task[], placeholder: string }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [inputValue, setInputValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const storageKey = `windtodo_tasks_${title.replace(/\s+/g, '_').toLowerCase()}`;

  useEffect(() => {
    const storedTasks = localStorage.getItem(storageKey);
    if (storedTasks) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTasks(JSON.parse(storedTasks));
      } catch (err) {
        console.error("Failed to parse tasks from localStorage", err);
      }
    }
     
    setIsLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded, storageKey]);

  const handleAddTask = () => {
    if (inputValue.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), title: inputValue.trim() }]);
      setInputValue('');
    }
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Only render content after loading to prevent hydration mismatch
  if (!isLoaded) return <GlassCard className="flex flex-col h-full min-h-[300px] animate-pulse" />;

  return (
    <GlassCard className="flex flex-col h-full">
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
          <div key={task.id} className="bg-white/5 border border-white/5 p-3 rounded-lg flex items-center justify-between group transition-all hover:bg-white/10">
            <span className="text-sm">{task.title}</span>
            <button 
              onClick={() => handleRemoveTask(task.id)}
              className="text-gray-600 group-hover:text-gray-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-auto relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 pl-4 pr-12 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
        />
        <button 
          onClick={handleAddTask}
          className="absolute right-2 top-1.5 p-1 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
      </div>
    </GlassCard>
  );
}
