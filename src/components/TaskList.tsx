'use client';

import { useState } from 'react';

type Task = {
  id: string;
  title: string;
};

export default function TaskList({ title, initialTasks, placeholder }: { title: string, initialTasks: Task[], placeholder: string }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [inputValue, setInputValue] = useState('');

  const handleAddTask = () => {
    if (inputValue.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), title: inputValue.trim() }]);
      setInputValue('');
    }
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="glass p-6 rounded-2xl flex flex-col h-full">
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
    </div>
  );
}
