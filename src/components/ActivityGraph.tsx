'use client';

import GlassCard from './GlassCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task } from '../types';
import { predefinedTags } from '../data/tags';

export default function ActivityGraph() {
  const [tasks] = useLocalStorage<Task[]>('tasks-all', []);

  const tagCounts = predefinedTags.map(tag => {
    return {
      tag,
      count: tasks.filter(t => (t.tags || []).includes(tag.id)).length
    };
  });
  
  const untaggedCount = tasks.filter(t => (t.tags || []).length === 0).length;
  const allCounts = [...tagCounts, { tag: { id: 'untagged', name: 'Untagged', color: '' }, count: untaggedCount }];
  const maxCount = Math.max(...allCounts.map(c => c.count), 1);

  return (
    <GlassCard className="lg:col-span-3">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Tasks by Label
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            Total Labeled Tasks: {tasks.filter(t => (t.tags || []).length > 0).length}
          </span>
        </div>
      </div>
      <div className="h-48 flex items-end justify-between px-2 gap-6">
        {allCounts.map((item) => {
          const heightPercent = Math.round((item.count / maxCount) * 100);
          return (
            <div key={item.tag.id} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex items-end justify-center h-32 relative">
                <div 
                  className="w-full bg-cyan-500/60 rounded-t-sm transition-all duration-700 hover:bg-cyan-400" 
                  style={{ height: `${heightPercent}%`, minHeight: item.count > 0 ? '4px' : '0px' }}
                ></div>
                <div className="absolute -top-6 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.count}
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate w-full text-center" title={item.tag.name}>
                {item.tag.name.substring(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
