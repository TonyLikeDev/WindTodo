'use client';

import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';
import { Trash2, Plus } from 'lucide-react';
import AddProjectModal from './AddProjectModal';
import { createProject, getProjects, deleteProject } from '@/app/actions/projectActions';

type Project = {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
};

export default function ProjectsSection() {
  const { data: projects = [], mutate, isLoading } = useSWR<Project[]>(
    'projects',
    getProjects,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );
  const [open, setOpen] = useState(false);

  const handleCreate = async (name: string, color: string) => {
    setOpen(false);
    const optimistic: Project = {
      id: `temp-${Date.now()}`,
      name,
      color,
      userId: 'temp',
      createdAt: new Date(),
    };
    mutate([...projects, optimistic], false);
    await createProject(name, color);
    mutate();
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this project? All lists and tasks will be permanently removed.')) {
      mutate(projects.filter(p => p.id !== projectId), false);
      await deleteProject(projectId);
      mutate();
    }
  };

  return (
    <div className="space-y-3">
      {isLoading && (
        <div className="space-y-3">
          <div className="glass rounded-2xl h-24 animate-pulse" />
          <div className="glass rounded-2xl h-24 animate-pulse" />
        </div>
      )}

      {!isLoading &&
        projects.map((p) => (
          <Link
            key={p.id}
            href={p.id.startsWith('temp-') ? '#' : `/projects/${p.id}`}
            className={`glass rounded-2xl p-4 flex flex-col min-h-[100px] hover:bg-white/5 transition-all duration-300 group relative border border-white/5 hover:border-white/20 ${
              p.id.startsWith('temp-') ? 'opacity-50 pointer-events-none' : ''
            }`}
            style={{ background: `linear-gradient(135deg, ${p.color}22, ${p.color}08)` }}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white truncate pr-10">{p.name}</h3>
              <div 
                className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                style={{ backgroundColor: p.color }} 
              />
            </div>
            
            <button
              onClick={(e) => handleDelete(e, p.id)}
              className="absolute top-4 right-4 p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
              title="Delete Project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <p className="text-[10px] text-gray-500 mt-auto flex items-center gap-1">
              Click to open board
            </p>
          </Link>
        ))}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full glass p-4 rounded-2xl flex items-center justify-center gap-3 min-h-[60px] hover:bg-white/10 transition-all border border-dashed border-white/10 group cursor-pointer"
      >
        <Plus className="w-4 h-4 text-gray-500 group-hover:text-white" />
        <span className="text-xs font-bold text-gray-500 group-hover:text-white uppercase tracking-widest">Add Project</span>
      </button>

      <AddProjectModal open={open} onClose={() => setOpen(false)} onCreate={handleCreate} />
    </div>
  );
}
