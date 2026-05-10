import { useState, useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { Task } from '../types';

export function useTaskBoard(listId: string, initialTasks: Task[] = []) {
  const lists = useTaskStore(state => state.lists);
  const initializeList = useTaskStore(state => state.initializeList);
  const setTasks = useTaskStore(state => state.setTasks);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    initializeList(listId, initialTasks);
  }, [listId, initialTasks, initializeList]);

  // Before hydration, return the initialTasks so SSR perfectly matches initial client render.
  // After hydration, return the store's lists[listId] if it exists, otherwise initialTasks.
  const tasks = isMounted ? (lists[listId] || initialTasks) : initialTasks;

  return [tasks, (newTasks: Task[] | ((prev: Task[]) => Task[])) => setTasks(listId, newTasks)] as const;
}
