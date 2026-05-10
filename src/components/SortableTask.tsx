'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { predefinedTags } from '../data/tags';
import { X, Clock, CheckSquare, AlertCircle, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

interface SortableTaskProps {
  task: Task;
  overdue: boolean;
  onTaskClick: (task: Task) => void;
  onRemoveTask: (taskId: string) => void;
}

export default function SortableTask({ task, overdue, onTaskClick, onRemoveTask }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const taskTags = predefinedTags.filter(tag => (task.tags || []).includes(tag.id));
  
  const displayTime = task.dueDate || task.time;

  const PriorityIcon = () => {
    switch(task.priority) {
      case 'urgent': return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'high': return <ArrowUp className="w-3 h-3 text-orange-400" />;
      case 'medium': return <ArrowRight className="w-3 h-3 text-gray-400" />;
      case 'low': return <ArrowDown className="w-3 h-3 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onTaskClick(task)}
      className={`bg-black/40 border p-3 rounded-lg group transition-all hover:bg-black/60 cursor-grab active:cursor-grabbing relative overflow-hidden ${overdue ? 'border-red-400/30 shadow-[0_0_10px_rgba(255,107,107,0.1)]' : 'border-white/10 hover:border-white/20'}`}
    >
      {task.priority === 'urgent' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
      {task.priority === 'high' && <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>}
      
      <div className="flex items-start justify-between gap-2 pl-1">
        <span className={`text-sm leading-snug ${overdue ? 'text-red-200' : 'text-gray-200'} ${task.status === 'done' ? 'line-through opacity-60' : ''}`}>
          {task.title}
        </span>
        <div className="flex items-center gap-1">
          <PriorityIcon />
          <button 
            onClick={(e) => { e.stopPropagation(); onRemoveTask(task.id); }}
            className="text-gray-600 hover:text-red-400 transition-colors shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {taskTags.length > 0 && (
        <div className="mt-2 pl-1 flex flex-wrap gap-1">
          {task._listName && (
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20 uppercase tracking-tighter">
              {task._listName}
            </span>
          )}
          {taskTags.map(tag => (
            <span key={tag.id} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${tag.color} opacity-80`}>
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {((task.checklist || []).length > 0 || displayTime || task.assignee) && (
        <div className="mt-2 pl-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {displayTime && (
              <span className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${overdue ? 'bg-red-950/40 text-red-400/90 border-red-500/30' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                {overdue && (
                  <Clock className="w-3 h-3" />
                )}
                {displayTime.replace('T', ' ')}
              </span>
            )}
            {(task.checklist || []).length > 0 && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                <CheckSquare className="w-3 h-3" />
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
}
