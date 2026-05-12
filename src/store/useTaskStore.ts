import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { Task, Tag } from '../types';
import { predefinedTags } from '../data/tags';

interface TaskState {
  lists: Record<string, Task[]>;
  initializeList: (listId: string, initialTasks: Task[]) => void;
  setTasks: (listId: string, tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  isSearchOpen: boolean;
  setSearchOpen: (isOpen: boolean) => void;
  tags: Tag[];
  addTag: (tag: Tag) => void;
  updateTag: (tag: Tag) => void;
  removeTag: (tagId: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      lists: {},
      isSearchOpen: false,
      tags: predefinedTags,
      setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
      addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
      updateTag: (tag) => set((state) => ({ tags: state.tags.map(t => t.id === tag.id ? tag : t) })),
      removeTag: (tagId) => set((state) => ({ tags: state.tags.filter(t => t.id !== tagId) })),
      initializeList: (listId, initialTasks) => set((state) => {
        if (!state.lists[listId]) {
          return { lists: { ...state.lists, [listId]: initialTasks } };
        }
        return state;
      }),
      setTasks: (listId, tasks) => set((state) => {
        const newTasks = typeof tasks === 'function' ? tasks(state.lists[listId] || []) : tasks;
        return { lists: { ...state.lists, [listId]: newTasks } };
      }),
      updateTask: (taskId, updatedTask) => set((state) => {
        const newLists = { ...state.lists };
        let found = false;

        for (const listId in newLists) {
          const taskIndex = newLists[listId].findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            newLists[listId] = [...newLists[listId]];
            const existingTask = newLists[listId][taskIndex];
            const newTask = { ...existingTask, ...updatedTask };
            newLists[listId][taskIndex] = newTask;
            
            // Handle recurrence
            if (updatedTask.status === 'done' && existingTask.status !== 'done' && existingTask.recurrence && existingTask.recurrence !== 'none') {
              const nextDate = new Date(existingTask.dueDate || new Date());
              if (existingTask.recurrence === 'daily') nextDate.setDate(nextDate.getDate() + 1);
              if (existingTask.recurrence === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
              if (existingTask.recurrence === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
              
              // format nextDate back to datetime-local string (YYYY-MM-DDTHH:mm)
              const offset = nextDate.getTimezoneOffset() * 60000;
              const nextDateStr = new Date(nextDate.getTime() - offset).toISOString().slice(0, 16);
              
              const recurringTask: Task = {
                ...existingTask,
                id: Date.now().toString() + Math.floor(Math.random() * 1000),
                status: 'todo',
                dueDate: nextDateStr,
                time: nextDateStr,
                checklist: (existingTask.checklist || []).map(c => ({ ...c, completed: false }))
              };
              newLists[listId].push(recurringTask);
              toast.info(`Recurring task created for ${existingTask.recurrence}`);
            }
            
            found = true;
            break;
          }
        }

        if (!found) {
          console.warn(`Task with ID ${taskId} not found in any list.`);
          return state;
        }

        return { lists: newLists };
      }),
    }),
    {
      name: 'windtodo-storage',
    }
  )
);
