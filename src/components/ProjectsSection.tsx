'use client';

import Link from 'next/link';
import { useState } from 'react';
import AddProjectModal from './AddProjectModal';
import { useLocalStorageState } from '@/utils/useLocalStorageState';

type Project = { id: string; name: string; color: string };

const STORAGE_KEY = 'windtodo:projects';
const EMPTY: Project[] = [];

export default function ProjectsSection() {
  const [projects, setProjects] = useLocalStorageState<Project[]>(STORAGE_KEY, EMPTY);
  const [open, setOpen] = useState(false);

  const handleCreate = (name: string, color: string) => {
    const id = `project_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setProjects((prev) => [...prev, { id, name, color }]);
    setOpen(false);
  };

  return (
    <>
      {projects.map((p) => (
        <Link
          key={p.id}
          href={`/dashboard/projects/${p.id}`}
          className="glass rounded-2xl p-6 flex flex-col min-h-[180px] hover:bg-white/5 transition-colors group"
          style={{ background: p.color }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-white truncate">{p.name}</h3>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="text-xs text-gray-400 mb-auto">Open board</p>
          <div className="mt-4 text-[11px] text-gray-500 uppercase tracking-wider">Project</div>
        </Link>
      ))}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center min-h-[180px] hover:bg-white/5 transition-colors group cursor-pointer"
      >
        <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-3 border border-white/10 group-hover:bg-white/10 transition-colors">
          <svg className="w-7 h-7 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-base font-medium text-white mb-1">Add Project</h3>
        <p className="text-xs text-gray-500 max-w-xs">
          New board with custom-colored lists.
        </p>
      </button>

      <AddProjectModal open={open} onClose={() => setOpen(false)} onCreate={handleCreate} />
    </>
  );
}
