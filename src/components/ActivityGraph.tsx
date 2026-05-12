'use client';

import GlassCard from './GlassCard';
import { useTaskStore } from '../store/useTaskStore';
import { useEffect, useState } from 'react';

export default function ActivityGraph() {
  const [mounted, setMounted] = useState(false);
  const lists = useTaskStore(state => state.lists);
  const storeTags = useTaskStore(state => state.tags);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <GlassCard className="lg:col-span-3 h-64 animate-pulse" />;
  }

  const allTasks = Object.values(lists).flat();
  const totalLabeled = allTasks.filter(t => (t.tags || []).length > 0).length;

  const tagCounts = storeTags.map(tag => ({
    tag,
    count: allTasks.filter(t => (t.tags || []).includes(tag.id)).length,
  }));

  const untaggedCount = allTasks.filter(t => (t.tags || []).length === 0).length;
  const allCounts = [
    ...tagCounts,
    { tag: { id: 'untagged', name: 'Untagged', color: 'text-gray-400 border-gray-500/30 bg-gray-500/10' }, count: untaggedCount },
  ];

  const maxCount = Math.max(...allCounts.map(c => c.count), 1);

  return (
    <GlassCard className="lg:col-span-3">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tasks by Label</h3>
          <p className="text-xs text-gray-600 mt-0.5">{totalLabeled} tasks are labeled</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-500 inline-block" />
          Count per tag
        </div>
      </div>

      <div className="h-48 flex items-end justify-between px-2 gap-4">
        {allCounts.map((item) => {
          const heightPercent = Math.max(Math.round((item.count / maxCount) * 100), item.count > 0 ? 4 : 0);
          return (
            <div key={item.tag.id} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex items-end justify-center h-32 relative">
                {/* Count label */}
                <div className="absolute -top-6 text-xs font-bold text-white bg-black/60 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.count} task{item.count !== 1 ? 's' : ''}
                </div>
                <div
                  className="w-full bg-accent-500/60 rounded-t transition-all duration-700 hover:bg-accent-400 group-hover:shadow-[0_0_12px_var(--accent-400)]"
                  style={{ height: `${heightPercent}%`, minHeight: item.count > 0 ? '4px' : '0' }}
                />
              </div>
              <span
                className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate w-full text-center"
                title={item.tag.name}
              >
                {item.tag.name.substring(0, 5)}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
