'use client';

import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';
import { Trash2, ArrowUpRight, Plus } from 'lucide-react';
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
    <>
      {isLoading && (
        <>
          <div className="glass rounded-2xl min-h-[180px] animate-pulse" />
          <div className="glass rounded-2xl min-h-[180px] animate-pulse" />
        </>
      )}

      {!isLoading &&
        projects.map((p) => (
          <Link
            key={p.id}
            href={p.id.startsWith('temp-') ? '#' : `/projects/${p.id}`}
            className={`glass rounded-[2rem] p-8 flex flex-col min-h-[220px] hover:bg-white/[0.04] transition-all duration-500 group relative border border-white/5 hover:border-white/20 hover:-translate-y-1 ${
              p.id.startsWith('temp-') ? 'opacity-50 pointer-events-none' : ''
            }`}
            style={{ 
              background: `radial-gradient(circle at top right, ${p.color}15, transparent), linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)` 
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: p.color, backgroundColor: 'currentColor' }} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Board</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">{p.name}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-all" />
              </div>
            </div>
            
            <button
              onClick={(e) => handleDelete(e, p.id)}
              className="absolute top-6 right-12 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <p className="text-xs text-gray-400 mb-auto">Open board</p>
            <div className="mt-4 text-[11px] text-gray-500 uppercase tracking-wider">Project</div>
          </Link>
        ))}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass p-8 rounded-[2rem] flex flex-col items-center justify-center text-center min-h-[220px] hover:bg-white/5 transition-all duration-500 border border-dashed border-white/10 group cursor-pointer hover:border-white/30"
      >
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all">
          <Plus className="w-8 h-8 text-gray-500 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">New Project</h3>
        <p className="text-xs text-gray-500 max-w-[150px]">
          Create a new workspace for your team.
        </p>
      </button>

      <AddProjectModal open={open} onClose={() => setOpen(false)} onCreate={handleCreate} />
    </>
  );
}
