'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar, User, Tag, Command, ArrowRight } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { Task } from '../types';
import { useRouter } from 'next/navigation';

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchPalette({ isOpen, onClose }: SearchPaletteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ tasks: Task[]; actions: any[] }>({ tasks: [], actions: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const lists = useTaskStore(state => state.lists);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery(''); // Clear query when opening via shortcut
      }
      
      if (!isOpen) return;

      if (e.key === 'Escape') onClose();
      
      const totalItems = results.tasks.length + results.actions.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults({
        tasks: [],
        actions: [
          { id: 'nav-dashboard', title: 'Go to Dashboard', icon: <ArrowRight className="w-4 h-4" />, action: () => router.push('/') },
          { id: 'nav-stats', title: 'View Statistics', icon: <ArrowRight className="w-4 h-4" />, action: () => router.push('/statistics') },
          { id: 'nav-tasks', title: 'Manage All Tasks', icon: <ArrowRight className="w-4 h-4" />, action: () => router.push('/tasks') },
        ]
      });
      return;
    }

    const searchTasks: Task[] = [];
    Object.entries(lists).forEach(([listName, tasks]) => {
      tasks.forEach(task => {
        if (task.title.toLowerCase().includes(query.toLowerCase()) || 
            task.description?.toLowerCase().includes(query.toLowerCase())) {
          searchTasks.push({ ...task, _listName: listName });
        }
      });
    });

    setResults({
      tasks: searchTasks.slice(0, 5),
      actions: [
        { id: 'create-task', title: `Create task: "${query}"`, icon: <Command className="w-4 h-4" />, action: () => alert('Feature coming soon!') }
      ]
    });
    setSelectedIndex(0);
  }, [query, lists, router]);

  const handleSelect = () => {
    const totalTasks = results.tasks.length;
    if (selectedIndex < totalTasks) {
      const task = results.tasks[selectedIndex];
      // For now, let's just alert and close. In a real app, we'd open the task modal.
      alert(`Opening task: ${task.title}`);
      onClose();
    } else {
      const action = results.actions[selectedIndex - totalTasks];
      action.action();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-full max-w-2xl bg-[#0a0a0a]/90 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative z-10"
          >
            {/* Search Input Area */}
            <div className="flex items-center p-4 border-b border-white/5">
              <Search className="w-5 h-5 text-gray-500 ml-2" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks, actions, or pages..."
                className="flex-grow bg-transparent border-none text-lg text-white px-4 focus:outline-none placeholder-gray-600"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 font-mono">ESC</span>
                <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
              {results.tasks.length === 0 && results.actions.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No results found for "{query}"</p>
                </div>
              )}

              {/* Tasks Section */}
              {results.tasks.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tasks</div>
                  {results.tasks.map((task, index) => (
                    <button
                      key={task.id}
                      onClick={handleSelect}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all group ${selectedIndex === index ? 'bg-white/10 ring-1 ring-white/10' : 'hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${task.status === 'done' ? 'bg-green-500/10 text-green-400' : 'bg-accent-500/10 text-accent-400'}`}>
                          <Command className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-accent-400 transition-colors">{task.title}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                            <span className="capitalize">{task._listName?.replace('dashboard-', '')}</span>
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 transition-all ${selectedIndex === index ? 'text-accent-400 translate-x-0 opacity-100' : 'text-gray-600 -translate-x-2 opacity-0'}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* Actions Section */}
              {results.actions.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quick Actions</div>
                  {results.actions.map((action, index) => {
                    const actualIndex = index + results.tasks.length;
                    return (
                      <button
                        key={action.id}
                        onClick={handleSelect}
                        onMouseEnter={() => setSelectedIndex(actualIndex)}
                        className={`w-full text-left p-3 rounded-xl flex items-center gap-4 transition-all ${selectedIndex === actualIndex ? 'bg-white/10 ring-1 ring-white/10' : 'hover:bg-white/5'}`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                          {action.icon}
                        </div>
                        <div className="text-sm font-medium text-white">{action.title}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span className="px-1 py-0.5 rounded bg-white/10 border border-white/10 text-gray-300">↑↓</span>
                  to navigate
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span className="px-1 py-0.5 rounded bg-white/10 border border-white/10 text-gray-300">ENTER</span>
                  to select
                </div>
              </div>
              <div className="text-[10px] text-gray-600 font-medium">
                WindTodo v1.0 Search
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
