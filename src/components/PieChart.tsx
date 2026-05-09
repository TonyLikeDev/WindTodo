'use client';

import GlassCard from './GlassCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task } from '../types';

export default function PieChart() {
  const [tasks] = useLocalStorage<Task[]>('tasks-all', []);

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const todo = tasks.filter(t => t.status === 'todo' || !t.status).length;

  const donePercent = total === 0 ? 0 : (done / total) * 100;
  const inProgressPercent = total === 0 ? 0 : (inProgress / total) * 100;
  const todoPercent = total === 0 ? 0 : (todo / total) * 100;

  return (
    <GlassCard className="flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider self-start">
        Task Distribution
      </h3>
      <div className="relative w-48 h-48">
        {/* Added overflow-visible to prevent the square clipping bug */}
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 overflow-visible">
          {/* Background Circle */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
          ></circle>
          
          {/* Green (Done) Segment */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="transparent"
            stroke="#00ffcc"
            strokeWidth="4"
            strokeDasharray={`${donePercent} 100`}
            strokeDashoffset="0"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0,255,204,0.6))', transition: 'stroke-dasharray 1s ease-out, stroke-dashoffset 1s ease-out' }}
          ></circle>
          
          {/* Yellow (In Progress) Segment */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="transparent"
            stroke="#ffee00"
            strokeWidth="4"
            strokeDasharray={`${inProgressPercent} 100`}
            strokeDashoffset={`-${donePercent}`}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 3px rgba(255,238,0,0.6))', transition: 'stroke-dasharray 1s ease-out, stroke-dashoffset 1s ease-out' }}
          ></circle>
          
          {/* Red (Pending) Segment */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="transparent"
            stroke="#ff0055"
            strokeWidth="4"
            strokeDasharray={`${todoPercent} 100`}
            strokeDashoffset={`-${donePercent + inProgressPercent}`}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 3px rgba(255,0,85,0.6))', transition: 'stroke-dasharray 1s ease-out, stroke-dashoffset 1s ease-out' }}
          ></circle>
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span 
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400"
            style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.15))' }}
          >
            {Math.round(donePercent)}%
          </span>
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
            Complete
          </span>
        </div>
      </div>
      
      <div className="mt-10 grid grid-cols-3 gap-4 w-full">
        <div className="text-center flex flex-col items-center">
          <div 
            className="w-3 h-3 rounded-full mb-2 bg-[#00ffcc]"
            style={{ boxShadow: '0 0 6px rgba(0,255,204,0.5)' }}
          ></div>
          <span className="text-[11px] font-medium text-gray-300">Done</span>
        </div>
        <div className="text-center flex flex-col items-center">
          <div 
            className="w-3 h-3 rounded-full mb-2 bg-[#ffee00]"
            style={{ boxShadow: '0 0 6px rgba(255,238,0,0.5)' }}
          ></div>
          <span className="text-[11px] font-medium text-gray-300">In Progress</span>
        </div>
        <div className="text-center flex flex-col items-center">
          <div 
            className="w-3 h-3 rounded-full mb-2 bg-[#ff0055]"
            style={{ boxShadow: '0 0 6px rgba(255,0,85,0.5)' }}
          ></div>
          <span className="text-[11px] font-medium text-gray-300">Pending</span>
        </div>
      </div>
    </GlassCard>
  );
}
