'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import AddProjectModal from './AddProjectModal';
import BoardColumn from './BoardColumn';
import { useLocalStorageState } from '@/utils/useLocalStorageState';

type Project = { id: string; name: string; color: string };
type BoardList = { id: string; name: string; color: string };

const PROJECTS_KEY = 'windtodo:projects';
const boardKey = (projectId: string) => `windtodo:board:${projectId}`;

const EMPTY_PROJECTS: Project[] = [];
const EMPTY_LISTS: BoardList[] = [];

export default function ProjectBoard({ projectId }: { projectId: string }) {
  const [projects] = useLocalStorageState<Project[]>(PROJECTS_KEY, EMPTY_PROJECTS);
  const [lists, setLists] = useLocalStorageState<BoardList[]>(
    boardKey(projectId),
    EMPTY_LISTS,
  );
  const [open, setOpen] = useState(false);

  const project = useMemo(
    () => projects.find((p) => p.id === projectId) ?? null,
    [projects, projectId],
  );

  const headerStyle = useMemo(
    () =>
      project
        ? {
            background: `linear-gradient(180deg, ${project.color} 0%, transparent 100%)`,
          }
        : undefined,
    [project],
  );

  const handleCreateList = (name: string, color: string) => {
    const id = `${projectId}_list_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setLists((prev) => [...prev, { id, name, color }]);
    setOpen(false);
  };

  const handleRemoveList = (id: string) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
  };

  if (!project) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
          ← Back to dashboard
        </Link>
        <div className="glass rounded-2xl p-8 text-center">
          <h2 className="text-lg font-semibold text-white mb-2">Project not found</h2>
          <p className="text-sm text-gray-400">
            This project doesn&apos;t exist on this device. Projects are stored locally per browser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -m-4 md:-m-8">
      <div className="px-4 md:px-8 pt-4 md:pt-8 pb-4" style={headerStyle}>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white mb-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar px-4 md:px-8 pb-6">
        <div className="flex gap-4 items-start min-h-full">
          {lists.map((l) => (
            <BoardColumn
              key={l.id}
              listId={l.id}
              title={l.name}
              color={l.color}
              onRemoveList={() => handleRemoveList(l.id)}
            />
          ))}

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-72 flex-shrink-0 rounded-2xl border border-dashed border-white/15 bg-white/5 hover:bg-white/10 transition-colors px-4 py-3 flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {lists.length === 0 ? 'Add a list' : 'Add another list'}
          </button>
        </div>
      </div>

      <AddProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreateList}
        title="New List"
        nameLabel="List name"
        namePlaceholder="e.g. To do"
        ctaLabel="Add list"
      />
    </div>
  );
}
