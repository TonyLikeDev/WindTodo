'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { Task, TaskStatus } from '../types';
import KanbanColumn from './KanbanColumn';
import GlassCard from './GlassCard';
import TaskModal from './TaskModal';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export default function KanbanBoard({ listId, initialTasks, isGlobal = false }: { listId?: string, initialTasks?: Task[], isGlobal?: boolean }) {
  const lists = useTaskStore(state => state.lists);
  const globalUpdateTask = useTaskStore(state => state.updateTask);
  const initializeList = useTaskStore(state => state.initializeList);
  const localSetTasks = useTaskStore(state => state.setTasks);

  const [isMounted, setIsMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (!isGlobal && listId && initialTasks) {
      initializeList(listId, initialTasks);
    }
  }, [isGlobal, listId, initialTasks, initializeList]);

  // Aggregate tasks based on mode
  const tasks = useMemo(() => {
    if (!isMounted) return initialTasks || [];
    if (isGlobal) {
      // Flatten all tasks from all lists and inject list name as a temporary property
      return Object.entries(lists).flatMap(([id, taskList]) => 
        taskList.map(t => ({ ...t, _listName: id.replace('dashboard-', '').replace('tasks-', '').replace('-', ' ') }))
      );
    }
    return lists[listId || ''] || initialTasks || [];
  }, [isGlobal, isMounted, lists, listId, initialTasks]);

  const setTasks = (newTasksOrFn: Task[] | ((prev: Task[]) => Task[])) => {
    if (isGlobal) {
      // In global mode, we handle updates via updateTask for status changes
      // Sorting is more complex, so we'll just handle the status updates for now
      // This is usually what's needed on the Dashboard
      return;
    }
    if (listId) {
      localSetTasks(listId, newTasksOrFn);
    }
  };

  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleUpdateTask = (updatedTask: Task) => {
    if (isGlobal) {
      globalUpdateTask(updatedTask.id, updatedTask);
    } else {
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    }
    toast.success(`Task "${updatedTask.title}" saved`);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Check if over is a column
    const isOverColumn = ['todo', 'in-progress', 'done'].includes(overId);

    if (isOverColumn) {
      const activeTask = tasks.find((t) => t.id === activeId);
      if (activeTask && activeTask.status !== overId) {
        if (isGlobal) {
          globalUpdateTask(activeId, { status: overId as TaskStatus });
        } else {
          setTasks(tasks.map((t) =>
            t.id === activeId ? { ...t, status: overId as TaskStatus } : t
          ));
        }
      }
      return;
    }

    // Over another task - handle status change if different
    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (activeTask && overTask && activeTask.status !== overTask.status) {
      if (isGlobal) {
        globalUpdateTask(activeId, { status: overTask.status });
      } else {
        setTasks((prevTasks) => {
          const newTasks = [...prevTasks];
          const activeIndex = newTasks.findIndex(t => t.id === activeId);
          newTasks[activeIndex] = { ...activeTask, status: overTask.status };
          return newTasks;
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || isGlobal) return; // Sorting only in local mode for now

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((t) => t.id === activeId);
        const overIndex = prevTasks.findIndex((t) => t.id === overId);
        
        if (activeIndex !== -1 && overIndex !== -1 && prevTasks[activeIndex].status === prevTasks[overIndex].status) {
          return arrayMove(prevTasks, activeIndex, overIndex);
        }
        return prevTasks;
      });
    }
  };

  const handleRemoveTask = (taskId: string) => {
    if (isGlobal) {
      // Find which list has the task and remove it
      const newLists = { ...lists };
      for (const id in newLists) {
        if (newLists[id].some(t => t.id === taskId)) {
          localSetTasks(id, newLists[id].filter(t => t.id !== taskId));
          break;
        }
      }
    } else if (listId) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
    toast('Task deleted');
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

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const todoTasks = filteredTasks.filter(t => t.status === 'todo' || !t.status);
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'done');

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <GlassCard className="flex flex-col h-full overflow-hidden min-h-[600px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Board View</h2>
            <div className="text-sm text-gray-400">Drag and drop tasks to update their status</div>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
            />
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 capitalize"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
          <KanbanColumn 
            title="To Do" 
            status="todo" 
            tasks={todoTasks} 
            onRemoveTask={handleRemoveTask}
            onTaskClick={setSelectedTaskForModal}
            isOverdue={(timeStr) => isMounted ? isOverdue(timeStr) : false}
          />
          <KanbanColumn 
            title="In Progress" 
            status="in-progress" 
            tasks={inProgressTasks} 
            onRemoveTask={handleRemoveTask}
            onTaskClick={setSelectedTaskForModal}
            isOverdue={(timeStr) => isMounted ? isOverdue(timeStr) : false}
          />
          <KanbanColumn 
            title="Done" 
            status="done" 
            tasks={doneTasks} 
            onRemoveTask={handleRemoveTask}
            onTaskClick={setSelectedTaskForModal}
            isOverdue={(timeStr) => isMounted ? isOverdue(timeStr) : false}
          />
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

      <DragOverlay>
        {/* Placeholder for the item being dragged */}
        {activeId ? (
          <div className="bg-black/60 border border-white/20 p-3 rounded-lg shadow-2xl opacity-80 cursor-grabbing rotate-3 scale-105">
            <span className="text-sm text-white">{tasks.find(t => t.id === activeId)?.title}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
