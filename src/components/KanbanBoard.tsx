'use client';

import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task, TaskStatus } from '../types';
import KanbanColumn from './KanbanColumn';
import GlassCard from './GlassCard';
import TaskModal from './TaskModal';

export default function KanbanBoard({ listId, initialTasks }: { listId: string, initialTasks: Task[] }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>(listId, initialTasks);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDrop = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
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

  const todoTasks = tasks.filter(t => t.status === 'todo' || !t.status);
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <GlassCard className="flex flex-col h-full overflow-hidden min-h-[600px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Board View</h2>
        <div className="text-sm text-gray-400">Drag and drop tasks to update their status</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        <KanbanColumn 
          title="To Do" 
          status="todo" 
          tasks={todoTasks} 
          onDrop={handleDrop} 
          onRemoveTask={handleRemoveTask}
          onTaskClick={setSelectedTaskForModal}
          isOverdue={isOverdue}
        />
        <KanbanColumn 
          title="In Progress" 
          status="in-progress" 
          tasks={inProgressTasks} 
          onDrop={handleDrop} 
          onRemoveTask={handleRemoveTask}
          onTaskClick={setSelectedTaskForModal}
          isOverdue={isOverdue}
        />
        <KanbanColumn 
          title="Done" 
          status="done" 
          tasks={doneTasks} 
          onDrop={handleDrop} 
          onRemoveTask={handleRemoveTask}
          onTaskClick={setSelectedTaskForModal}
          isOverdue={isOverdue}
        />
      </div>
      {selectedTaskForModal && (
        <TaskModal 
          task={selectedTaskForModal} 
          onClose={() => setSelectedTaskForModal(null)} 
          onUpdateTask={handleUpdateTask} 
        />
      )}
    </GlassCard>
  );
}
