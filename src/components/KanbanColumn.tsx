'use client';

import { Task, TaskStatus } from '../types';
import { predefinedTags } from '../data/tags';
import { X, Clock, CheckSquare } from 'lucide-react';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTask from './SortableTask';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onRemoveTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  isOverdue: (timeStr?: string) => boolean;
  onUpdateStatus?: (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => void;
}

export default function KanbanColumn({ title, status, tasks, onRemoveTask, onTaskClick, isOverdue, onUpdateStatus }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  // Color mappings based on status for the column header
  const statusColors = {
    'todo': 'text-gray-300 border-gray-600',
    'in-progress': 'text-accent-400 border-accent-500/50',
    'done': 'text-green-400 border-green-500/50'
  };

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col bg-white/5 border rounded-2xl p-4 h-full min-h-[500px] transition-colors ${isOver ? 'border-accent-500/50 bg-white/10' : 'border-white/5'}`}
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
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTask 
              key={task.id} 
              task={task} 
              overdue={isOverdue(task.time) && status !== 'done'}
              onTaskClick={onTaskClick}
              onRemoveTask={onRemoveTask}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg text-gray-600 text-sm">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
