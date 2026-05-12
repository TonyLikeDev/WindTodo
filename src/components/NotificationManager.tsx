'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { isTaskOverdue } from '../utils/dateUtils';
import { toast } from 'sonner';

export default function NotificationManager() {
  const [mounted, setMounted] = useState(false);
  const lists = useTaskStore(state => state.lists);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check all tasks across all lists
    let overdueCount = 0;
    let dueTodayCount = 0;
    
    const todayStr = new Date().toISOString().split('T')[0];

    Object.values(lists).forEach(taskList => {
      taskList.forEach(task => {
        if (task.status === 'done') return;
        
        const isOverdue = isTaskOverdue(task.dueDate || task.time);
        if (isOverdue) {
          overdueCount++;
        } else if (task.dueDate && task.dueDate.startsWith(todayStr)) {
          dueTodayCount++;
        } else if (task.time && task.time.startsWith(todayStr)) {
          dueTodayCount++;
        }
      });
    });

    if (overdueCount > 0) {
      toast.error(`You have ${overdueCount} overdue task${overdueCount > 1 ? 's' : ''}!`, {
        duration: 8000,
      });
    }

    if (dueTodayCount > 0) {
      toast.info(`You have ${dueTodayCount} task${dueTodayCount > 1 ? 's' : ''} due today.`, {
        duration: 5000,
      });
    }

  }, [mounted]); // Only run once on mount (when hydration is done)

  return null;
}
