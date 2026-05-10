import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { Task } from '../types';

interface TaskState {
  lists: Record<string, Task[]>;
  initializeList: (listId: string, initialTasks: Task[]) => void;
  setTasks: (listId: string, tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      lists: {},
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
            newLists[listId][taskIndex] = { ...newLists[listId][taskIndex], ...updatedTask };
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
