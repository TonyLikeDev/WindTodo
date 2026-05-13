'use client';

import Link from 'next/link';
import { MouseEvent as ReactMouseEvent, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import BoardColumn, { DEFAULT_LIST_COLOR } from './BoardColumn';
import { BoardDragProvider, DraggableTask } from './BoardDragContext';
import { moveTask, updateTask } from '@/app/actions/taskActions';
import {
  createBoardList,
  deleteBoardList,
  getBoardLists,
  getProjects,
  renameBoardList,
  updateBoardListColor,
} from '@/app/actions/projectActions';
import { getAllUsers, addMemberToProject, removeMemberFromProject } from '@/app/actions/userActions';
import { Users, Plus, ChevronLeft, BarChart2 } from 'lucide-react';

type UserProfile = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  email: string;
};

type Project = {
  id: string;
  name: string;
  color: string;
  userId: string;
  members: UserProfile[];
  createdAt: Date;
};

type BoardList = {
  id: string;
  name: string;
  color: string;
  userId: string;
  projectId: string;
  position: number;
  createdAt: Date;
};

export default function ProjectBoard({ projectId }: { projectId: string }) {
  const { data: projects = [], mutate: mutateProjects, isLoading: projectsLoading } = useSWR<Project[]>(
    'projects',
    getProjects,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  );
  const { data: allUsers = [] } = useSWR('users', getAllUsers, { revalidateOnFocus: false, dedupingInterval: 60000 });
  
  const { data: lists = [], mutate, isLoading: listsLoading } = useSWR<BoardList[]>(
    `board:${projectId}`,
    () => getBoardLists(projectId),
    { revalidateOnFocus: false, dedupingInterval: 5000 }
  );
  const [draft, setDraft] = useState<{ id: string; color: string; index: number } | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const listsContainerRef = useRef<HTMLDivElement>(null);

  const project = useMemo(
    () => projects.find((p) => p.id === projectId) ?? null,
    [projects, projectId],
  );

  const startDraft = (index: number) => {
    if (draft) return;
    setDraft({
      id: `draft-${Date.now()}`,
      color: DEFAULT_LIST_COLOR,
      index: Math.max(0, Math.min(index, lists.length)),
    });
  };

  const cancelDraft = () => setDraft(null);

  const commitDraft = async (name: string) => {
    if (!draft) return;
    const { color, index } = draft;
    setDraft(null);

    const optimistic: BoardList = {
      id: `temp-${Date.now()}`,
      name,
      color,
      userId: 'temp',
      projectId,
      position: index,
      createdAt: new Date(),
    };
    const next = [
      ...lists.slice(0, index),
      optimistic,
      ...lists.slice(index),
    ].map((l, i) => ({ ...l, position: i }));
    mutate(next, false);

    await createBoardList(projectId, name, color, index);
    mutate();
  };

  const handleAddMember = async (userId: string) => {
    try {
      await addMemberToProject(projectId, userId);
      await mutateProjects();
      console.log('Member added successfully:', userId);
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMemberFromProject(projectId, userId);
      await mutateProjects();
      console.log('Member removed successfully:', userId);
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const handleRemoveList = async (id: string) => {
    mutate(lists.filter((l) => l.id !== id), false);
    await deleteBoardList(id);
    mutate();
  };

  const handleRenameList = async (id: string, newName: string) => {
    mutate(
      lists.map((l) => (l.id === id ? { ...l, name: newName } : l)),
      false,
    );
    await renameBoardList(id, newName);
    mutate();
  };

  const handleChangeListColor = async (id: string, color: string) => {
    mutate(
      lists.map((l) => (l.id === id ? { ...l, color } : l)),
      false,
    );
    await updateBoardListColor(id, color);
    mutate();
  };

  const handleBoardDoubleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (draft) return;
    const container = listsContainerRef.current;
    if (!container) return;

    const listEls = Array.from(container.children).slice(0, lists.length);
    const x = e.clientX;
    let insertAt = listEls.length;
    for (let i = 0; i < listEls.length; i++) {
      const r = (listEls[i] as HTMLElement).getBoundingClientRect();
      const mid = r.left + r.width / 2;
      if (x < mid) {
        insertAt = i;
        break;
      }
    }
    startDraft(insertAt);
  };

  // Map column name → task status for automatic status update on drag
  const getStatusFromListName = (listName: string): 'TODO' | 'IN_PROGRESS' | 'DONE' | null => {
    const n = listName.toLowerCase().trim();
    if (n === 'to do' || n === 'todo') return 'TODO';
    if (n === 'in progress') return 'IN_PROGRESS';
    if (n === 'done' || n === 'completed') return 'DONE';
    return null;
  };

  const handleDrop = useCallback(
    async (
      task: DraggableTask,
      sourceListId: string,
      targetListId: string,
      targetIndex: number,
    ) => {
      // Determine new status from target column name
      const targetList = lists.find((l) => l.id === targetListId);
      const newStatus = targetList ? getStatusFromListName(targetList.name) : null;

      if (sourceListId === targetListId) {
        globalMutate(
          targetListId,
          (cur: DraggableTask[] = []) => {
            const without = cur.filter((t) => t.id !== task.id);
            const clamped = Math.max(0, Math.min(targetIndex, without.length));
            const next = [
              ...without.slice(0, clamped),
              task,
              ...without.slice(clamped),
            ];
            return next.map((t, i) => ({ ...t, position: i }));
          },
          false,
        );
      } else {
        globalMutate(
          sourceListId,
          (cur: DraggableTask[] = []) =>
            cur
              .filter((t) => t.id !== task.id)
              .map((t, i) => ({ ...t, position: i })),
          false,
        );
        globalMutate(
          targetListId,
          (cur: DraggableTask[] = []) => {
            const clamped = Math.max(0, Math.min(targetIndex, cur.length));
            const updatedTask = newStatus
              ? { ...task, listId: targetListId, status: newStatus }
              : { ...task, listId: targetListId };
            const next = [
              ...cur.slice(0, clamped),
              updatedTask,
              ...cur.slice(clamped),
            ];
            return next.map((t, i) => ({ ...t, position: i }));
          },
          false,
        );
      }

      try {
        await moveTask(task.id, targetListId, targetIndex);
        // Auto-update status based on which column the task was dropped into
        if (newStatus && sourceListId !== targetListId) {
          await updateTask(task.id, { status: newStatus });
        }
      } finally {
        globalMutate(sourceListId);
        if (sourceListId !== targetListId) globalMutate(targetListId);
      }
    },
    [lists],
  );

  if (projectsLoading) {
    return (
      <div className="flex h-full animate-in fade-in duration-500">
        <div className="w-72 flex-shrink-0 bg-black/20 border-r border-white/5" />
        <div className="flex-1 p-6 space-y-4">
          <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
          <div className="flex gap-4">
            <div className="w-72 h-96 bg-white/5 rounded-2xl animate-pulse" />
            <div className="w-72 h-96 bg-white/5 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 space-y-4 max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
        <div className="glass rounded-3xl p-12 text-center border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-6">
            This project doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
          <Link href="/dashboard" className="px-6 py-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <BoardDragProvider onDrop={handleDrop}>
      <div className="flex h-full w-full overflow-hidden bg-[#0a0a0a]">
        {/* Main board area */}
        <div
          className="flex-1 flex flex-col overflow-hidden relative"
          style={{
            background: `radial-gradient(circle at top right, ${project.color}33, transparent), linear-gradient(180deg, rgba(0,0,0,0.4) 0%, #0a0a0a 100%)`,
          }}
        >
          {/* Header */}
          <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-md bg-black/20 z-10">
            <div className="flex items-center gap-6 min-w-0">
              <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight truncate">
                  {project.name}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Project</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Member Avatars */}
              <div className="flex -space-x-2 overflow-hidden mr-2">
                {project.members.map((m) => (
                  <div key={m.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-black bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white border border-white/10" title={m.name || m.email}>
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt={m.name || ''} className="h-full w-full object-cover" />
                    ) : (
                      (m.name || m.email).charAt(0).toUpperCase()
                    )}
                  </div>
                ))}
                <button 
                  onClick={() => setShowMemberModal(true)}
                  className="inline-flex h-8 w-8 rounded-full ring-2 ring-black bg-white/5 items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-white/10 border-dashed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="h-8 w-px bg-white/10 mx-2" />

              <Link 
                href="/dashboard/stats" 
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all border border-white/5"
              >
                <BarChart2 className="w-4 h-4" />
                Stats
              </Link>
            </div>
          </header>

          {/* Board Content */}
          <div
            className="flex-1 overflow-x-auto custom-scrollbar p-8"
            onDoubleClick={handleBoardDoubleClick}
          >
            <div
              ref={listsContainerRef}
              className="flex gap-6 items-start min-h-full"
              onDoubleClick={handleBoardDoubleClick}
            >
              {listsLoading && lists.length === 0 && (
                <div className="flex gap-6">
                  <div className="w-72 h-96 bg-white/2 rounded-3xl animate-pulse" />
                  <div className="w-72 h-96 bg-white/2 rounded-3xl animate-pulse" />
                </div>
              )}

              {(() => {
                const draftIndex = draft?.index ?? -1;
                const items: ReactNode[] = [];
                for (let i = 0; i <= lists.length; i++) {
                  if (draft && i === draftIndex) {
                    items.push(
                      <BoardColumn
                        key={draft.id}
                        listId={draft.id}
                        title=""
                        color={draft.color}
                        isDraft
                        onDraftCommit={commitDraft}
                        onDraftCancel={cancelDraft}
                        members={project.members}
                      />,
                    );
                  }
                  if (i < lists.length) {
                    const l = lists[i];
                    items.push(
                      <BoardColumn
                        key={l.id}
                        listId={l.id}
                        title={l.name}
                        color={l.color}
                        members={project.members}
                        onRemoveList={() => handleRemoveList(l.id)}
                        onRename={(name) => handleRenameList(l.id, name)}
                        onChangeColor={(c) => handleChangeListColor(l.id, c)}
                      />,
                    );
                  }
                }
                return items;
              })()}

              <button
                type="button"
                onClick={() => startDraft(lists.length)}
                className="w-72 flex-shrink-0 rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all px-4 py-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-300 group"
              >
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {lists.length === 0 ? 'Add First List' : 'Add New Column'}
              </button>
            </div>
          </div>
        </div>

        {/* Member Invite Modal Overlay */}
        {showMemberModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowMemberModal(false)} />
            <div className="relative glass w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  Manage Members
                </h3>
                <p className="text-xs text-gray-500 mt-1">Add or remove members from this project.</p>
              </div>

              <div className="p-6 max-h-[480px] overflow-y-auto custom-scrollbar space-y-6">
                {/* Current Members */}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Current Members ({project.members.length})</p>
                  <div className="space-y-2">
                    {project.members.map(m => {
                      const isCreator = m.id === project.userId;
                      return (
                        <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white overflow-hidden border border-white/10">
                              {m.avatarUrl ? <img src={m.avatarUrl} className="w-full h-full object-cover" alt={m.name || ''} /> : (m.name || m.email).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{m.name || 'User'}</p>
                              <p className="text-[10px] text-gray-500">{m.email}</p>
                            </div>
                          </div>
                          {isCreator ? (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/10 text-gray-400">Owner</span>
                          ) : (
                            <button
                              onClick={() => handleRemoveMember(m.id)}
                              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Remove member"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add New Members */}
                {(() => {
                  const available = allUsers.filter(u => !project.members.some(m => m.id === u.id));
                  if (available.length === 0) return null;
                  return (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Add Members</p>
                      <div className="space-y-2">
                        {available.map(u => (
                          <div key={u.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white overflow-hidden border border-white/5">
                                {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full rounded-full object-cover" alt={u.name || ''} /> : (u.name || u.email).charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">{u.name || 'User'}</p>
                                <p className="text-[10px] text-gray-500">{u.email}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddMember(u.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black rounded-lg transition-all text-xs font-bold"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="p-4 bg-black/20 flex justify-end border-t border-white/5">
                <button
                  onClick={() => setShowMemberModal(false)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BoardDragProvider>
  );
}
