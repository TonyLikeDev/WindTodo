'use client';

import { Task, TaskStatus } from '../types';
import { predefinedTags } from '../data/tags';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
  onRemoveTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  isOverdue: (timeStr?: string) => boolean;
}

export default function KanbanColumn({ title, status, tasks, onDrop, onRemoveTask, onTaskClick, isOverdue }: KanbanColumnProps) {
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onDrop(taskId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  // Color mappings based on status for the column header
  const statusColors = {
    'todo': 'text-gray-300 border-gray-600',
    'in-progress': 'text-cyan-400 border-cyan-500/50',
    'done': 'text-green-400 border-green-500/50'
  };

  return (
    <div 
      className="flex flex-col bg-white/5 border border-white/5 rounded-2xl p-4 h-full min-h-[500px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`flex items-center justify-between mb-4 pb-2 border-b ${statusColors[status]}`}>
        <h3 className="font-semibold uppercase tracking-wider text-sm">
          {title}
        </h3>
        <span className="text-xs bg-black/40 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="flex-grow space-y-3 overflow-y-auto custom-scrollbar pr-2 -mr-2">
        {tasks.map(task => {
          const overdue = isOverdue(task.time) && status !== 'done';
          const taskTags = predefinedTags.filter(tag => (task.tags || []).includes(tag.id));
          return (
            <div 
              key={task.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onClick={() => onTaskClick(task)}
              className={`bg-black/40 border p-3 rounded-lg group transition-all hover:bg-black/60 cursor-pointer ${overdue ? 'border-red-400/30 shadow-[0_0_10px_rgba(255,107,107,0.1)]' : 'border-white/10 hover:border-white/20'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`text-sm leading-snug ${overdue ? 'text-red-200' : 'text-gray-200'} ${status === 'done' ? 'line-through opacity-60' : ''}`}>
                  {task.title}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveTask(task.id); }}
                  className="text-gray-600 hover:text-red-400 transition-colors shrink-0 mt-0.5 opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              
              {taskTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {taskTags.map(tag => (
                    <span key={tag.id} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${tag.color} opacity-80`}>
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {((task.checklist || []).length > 0 || task.time || task.assignee) && (
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {task.time && (
                      <span className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${overdue ? 'bg-red-950/40 text-red-400/90 border-red-500/30' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                        {overdue && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                          </svg>
                        )}
                        {task.time}
                      </span>
                    )}
                    {(task.checklist || []).length > 0 && (
                      <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {(task.checklist || []).filter(c => c.completed).length}/{(task.checklist || []).length}
                      </span>
                    )}
                  </div>
                  
                  {task.assignee && (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold text-white border border-white/20" title={task.assignee.name}>
                      {task.assignee.avatar}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg text-gray-600 text-sm">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
