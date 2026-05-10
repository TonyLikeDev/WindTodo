'use client';

import { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { useTaskBoard } from '../hooks/useTaskBoard';
import { Clock, CheckSquare, X, Plus, Calendar, User as UserIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

import { Task, User } from '../types';
import { mockUsers } from '../data/users';
import { predefinedTags } from '../data/tags';
import TaskModal from './TaskModal';

export default function TaskList({ listId, title, initialTasks, placeholder }: { listId: string, title: string, initialTasks: Task[], placeholder: string }) {
  const [tasks, setTasks] = useTaskBoard(listId, initialTasks);
  const [inputValue, setInputValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    toast.success(`Task "${updatedTask.title}" saved`);
  };

  const handleAddTask = () => {
    if (inputValue.trim()) {
      let combinedTime = '';
      if (dateValue && timeValue) combinedTime = `${dateValue} ${timeValue}`;
      else if (dateValue) combinedTime = dateValue;
      else if (timeValue) combinedTime = timeValue;

      setTasks([...tasks, { 
        id: Date.now().toString(), 
        title: inputValue.trim(),
        status: 'todo',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        ...(combinedTime ? { dueDate: combinedTime, time: combinedTime } : {}), // Keep time for backward compatibility temporarily
        ...(selectedUser ? { assignee: selectedUser } : {})
      }]);
      toast.success(`Task "${inputValue.trim()}" created`);
      setInputValue('');
      setTimeValue('');
      setDateValue('');
      setSelectedUser(null);
      setIsUserMenuOpen(false);
    }
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast('Task deleted', {
      description: 'The task has been permanently removed.'
    });
  };

  const isOverdue = (timeStr?: string) => {
    if (!timeStr) return false;
    
    let dateToCompare = new Date();
    const now = new Date();
    
    if (timeStr.includes('-') && timeStr.includes(':')) {
      dateToCompare = new Date(timeStr.replace(' ', 'T'));
    } else if (timeStr.includes('-')) {
      dateToCompare = new Date(`${timeStr}T23:59:59`);
    } else if (timeStr.includes(':')) {
      const today = now.toISOString().split('T')[0];
      dateToCompare = new Date(`${today}T${timeStr}:00`);
    } else {
      return false; 
    }
    
    return dateToCompare < now;
  };

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
        <AnimatePresence initial={false}>
        {tasks.map(task => {
          const overdue = isMounted ? isOverdue(task.time) : false;
          const taskTags = predefinedTags.filter(tag => (task.tags || []).includes(tag.id));
          return (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            onClick={() => setSelectedTaskForModal(task)}
            className={`bg-white/5 border p-3 rounded-lg flex items-center justify-between group transition-all hover:bg-white/10 cursor-pointer ${overdue ? 'border-red-400/20 shadow-[0_0_15px_rgba(255,107,107,0.05)]' : 'border-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm ${overdue ? 'text-red-200' : 'text-gray-200'}`}>{task.title}</span>
              <div className="flex items-center gap-2">
                {task.time && (
                  <span className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${overdue ? 'bg-red-950/40 text-red-400/90 border-red-500/30' : 'bg-black/40 text-cyan-400/80 border-cyan-500/20'}`}>
                    {overdue && (
                      <Clock className="w-3 h-3" />
                    )}
                    {task.time}
                  </span>
                )}
                {taskTags.map(tag => (
                  <span key={tag.id} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${tag.color} opacity-80`}>
                    {tag.name}
                  </span>
                ))}
                {(task.checklist || []).length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                    <CheckSquare className="w-3 h-3" />
                    {(task.checklist || []).filter(c => c.completed).length}/{(task.checklist || []).length}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {task.assignee && (
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold text-white border border-white/20" title={task.assignee.name}>
                  {task.assignee.avatar}
                </div>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); handleRemoveTask(task.id); }}
                className="text-gray-600 group-hover:text-gray-400 transition-colors shrink-0 ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
          );
        })}
        </AnimatePresence>
      </div>
      <div className="mt-auto flex flex-col gap-2">
        <div className="relative">
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
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2 border border-white/5">
          <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
          <input 
            type="date"
            className="bg-transparent border-none text-xs text-gray-300 focus:outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.6] w-28"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
          />
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <Clock className="w-4 h-4 text-gray-500 shrink-0" />
          <input 
            type="time"
            className="bg-transparent border-none text-xs text-gray-300 focus:outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.6] flex-grow"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
          />
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              title={selectedUser ? selectedUser.name : "Assign user"}
            >
              {selectedUser ? (
                <span className="text-[9px] font-bold text-white">{selectedUser.avatar}</span>
              ) : (
                <UserIcon className="w-3 h-3 text-gray-400" />
              )}
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
                <div className="p-2 border-b border-white/5 text-xs font-semibold text-gray-400">Assign to</div>
                <div className="max-h-48 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedUser(null); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-white/5 flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full border border-dashed border-gray-600 flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </div>
                    Unassigned
                  </button>
                  {mockUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => { setSelectedUser(user); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5 flex items-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold border border-white/10">
                        {user.avatar}
                      </div>
                      {user.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selectedTaskForModal && (
          <TaskModal 
            task={selectedTaskForModal} 
            onClose={() => setSelectedTaskForModal(null)} 
            onUpdateTask={handleUpdateTask} 
          />
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
