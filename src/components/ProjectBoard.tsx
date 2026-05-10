'use client';

import Link from 'next/link';
import { MouseEvent as ReactMouseEvent, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import BoardColumn, { DEFAULT_LIST_COLOR } from './BoardColumn';
import { BoardDragProvider, DraggableTask } from './BoardDragContext';
import { moveTask } from '@/app/actions/taskActions';
import {
  createBoardList,
  deleteBoardList,
  getBoardLists,
  getProjects,
  renameBoardList,
  updateBoardListColor,
} from '@/app/actions/projectActions';

type Project = {
  id: string;
  name: string;
  color: string;
  userId: string;
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
  const { data: projects = [], isLoading: projectsLoading } = useSWR<Project[]>(
    'projects',
    getProjects,
  );
  const { data: lists = [], mutate, isLoading: listsLoading } = useSWR<BoardList[]>(
    `board:${projectId}`,
    () => getBoardLists(projectId),
  );
  const [draft, setDraft] = useState<{ id: string; color: string; index: number } | null>(null);
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

    // Children: [list1, list2, ..., addAnotherListButton]. Skip the trailing
    // button when computing the insertion index from list rects.
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

  const handleDrop = useCallback(
    async (
      task: DraggableTask,
      sourceListId: string,
      targetListId: string,
      targetIndex: number,
    ) => {
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
            const next = [
              ...cur.slice(0, clamped),
              { ...task, listId: targetListId },
              ...cur.slice(clamped),
            ];
            return next.map((t, i) => ({ ...t, position: i }));
          },
          false,
        );
      }

      try {
        await moveTask(task.id, targetListId, targetIndex);
      } finally {
        globalMutate(sourceListId);
        if (sourceListId !== targetListId) globalMutate(targetListId);
      }
    },
    [],
  );

  if (projectsLoading) {
    return (
      <div className="flex h-full">
        <div className="w-72 flex-shrink-0 bg-black/20 border-r border-white/5" />
        <div className="flex-1 p-6 space-y-4">
          <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
          <div className="flex gap-4">
            <div className="w-72 h-72 bg-white/5 rounded-2xl animate-pulse" />
            <div className="w-72 h-72 bg-white/5 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 space-y-4">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
          ← Back to dashboard
        </Link>
        <div className="glass rounded-2xl p-8 text-center">
          <h2 className="text-lg font-semibold text-white mb-2">Project not found</h2>
          <p className="text-sm text-gray-400">
            This project doesn&apos;t exist or you don&apos;t have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BoardDragProvider onDrop={handleDrop}>
    <div className="flex h-full w-full">
      {/* Inbox sidebar — tasks not yet assigned to any list */}
      <aside className="w-72 flex-shrink-0 bg-black/30 backdrop-blur border-r border-white/5 p-3 overflow-y-auto custom-scrollbar">
        <BoardColumn
          listId={`${projectId}_inbox`}
          title="Inbox"
          color="rgba(255, 255, 255, 0.04)"
          className="w-full"
        />
      </aside>

      {/* Main board area with project's color */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${project.color}, rgba(0,0,0,0.2))`,
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/10 flex-shrink-0">
          <h1 className="text-lg font-bold text-white tracking-tight truncate">
            {project.name}
          </h1>
        </div>

        <div
          className="flex-1 overflow-x-auto custom-scrollbar p-4"
          onDoubleClick={handleBoardDoubleClick}
          title="Double-click empty space to add a list here"
        >
          <div
            ref={listsContainerRef}
            className="flex gap-4 items-start min-h-full"
            onDoubleClick={handleBoardDoubleClick}
          >
            {listsLoading && lists.length === 0 && (
              <>
                <div className="w-72 h-72 bg-white/5 rounded-2xl animate-pulse flex-shrink-0" />
                <div className="w-72 h-72 bg-white/5 rounded-2xl animate-pulse flex-shrink-0" />
              </>
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
              className="w-72 flex-shrink-0 rounded-2xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors px-4 py-3 flex items-center gap-2 text-sm text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {lists.length === 0 ? 'Add a list' : 'Add another list'}
            </button>
          </div>
        </div>
      </div>

    </div>
    </BoardDragProvider>
  );
}
