'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { createTask, deleteTask, getTasks } from '@/app/actions/taskActions';
import { useBoardDrag } from './BoardDragContext';

type Task = {
  id: string;
  title: string;
  listId: string;
  userId: string;
  position: number;
  createdAt: Date;
};

export default function BoardColumn({
  listId,
  title,
  color,
  onRemoveList,
  className = 'w-72 flex-shrink-0 max-h-[calc(100vh-220px)]',
}: {
  listId: string;
  title: string;
  color: string;
  onRemoveList?: () => void;
  className?: string;
}) {
  const { data: tasks = [], mutate, isLoading } = useSWR<Task[]>(listId, getTasks);
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const { registerDropTarget, startDrag, draggingTaskId, hoveredSlot } = useBoardDrag();

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  useEffect(() => {
    const el = columnRef.current;
    if (!el) return;
    registerDropTarget(listId, {
      el,
      getDropSlot: (_x: number, y: number) => {
        const visible = tasks.filter((t) => t.id !== draggingTaskId);
        for (let i = 0; i < visible.length; i++) {
          const node = cardRefs.current.get(visible[i].id);
          if (!node) continue;
          const r = node.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          if (y < mid) return { listId, index: i };
        }
        return { listId, index: visible.length };
      },
    });
    return () => registerDropTarget(listId, null);
  }, [listId, registerDropTarget, draggingTaskId, tasks]);

  const submit = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setAdding(false);
      setValue('');
      return;
    }
    const optimistic: Task = {
      id: `temp-${Date.now()}`,
      title: trimmed,
      listId,
      userId: 'temp',
      position: tasks.length,
      createdAt: new Date(),
    };
    mutate([...tasks, optimistic], false);
    setValue('');
    await createTask(trimmed, listId);
    mutate();
  };

  const remove = async (id: string) => {
    mutate(tasks.filter((t) => t.id !== id), false);
    await deleteTask(id);
    mutate();
  };

  const isHoveredHere = hoveredSlot?.listId === listId;
  const visibleTasks = useMemo(
    () => tasks.filter((t) => t.id !== draggingTaskId),
    [tasks, draggingTaskId],
  );

  return (
    <div
      ref={columnRef}
      className={`rounded-2xl border flex flex-col transition-colors ${className} ${
        isHoveredHere && draggingTaskId
          ? 'border-white/40 ring-2 ring-white/20'
          : 'border-white/10'
      }`}
      style={{ background: color }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
          <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        {onRemoveList && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="text-gray-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="List options"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-lg overflow-hidden min-w-[140px]">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onRemoveList();
                  }}
                  className="block w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete list
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 custom-scrollbar">
        {isLoading && (
          <div className="space-y-2">
            <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
          </div>
        )}
        {!isLoading && (
          <div className="flex flex-col">
            {visibleTasks.map((t, i) => {
              const isTemp = t.id.startsWith('temp-');
              const showLineAbove = isHoveredHere && hoveredSlot?.index === i;
              return (
                <div key={t.id}>
                  <DropLine show={!!showLineAbove} />
                  <div
                    ref={(el) => {
                      if (el) cardRefs.current.set(t.id, el);
                      else cardRefs.current.delete(t.id);
                    }}
                    onPointerDown={(e) => {
                      if (isTemp) return;
                      if (e.button !== 0) return;
                      if ((e.target as HTMLElement).closest('button')) return;
                      e.preventDefault();
                      startDrag(t, e, listId);
                    }}
                    className={`bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-2 my-1 rounded-lg text-sm text-white flex items-start justify-between gap-2 group select-none touch-none ${
                      isTemp ? 'opacity-50 cursor-default' : 'cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    <span className="break-words flex-1">{t.title}</span>
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => remove(t.id)}
                      aria-label="Delete card"
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-white transition-opacity flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
            <DropLine
              show={
                !!isHoveredHere &&
                hoveredSlot?.index === visibleTasks.length
              }
            />
          </div>
        )}
      </div>

      <div className="p-2 pt-0">
        {adding ? (
          <div className="space-y-2">
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                  setAdding(true);
                } else if (e.key === 'Escape') {
                  setAdding(false);
                  setValue('');
                }
              }}
              placeholder="Enter a title for this card..."
              rows={2}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/30 resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  submit();
                  setAdding(true);
                }}
                className="px-3 py-1.5 text-xs bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                Add card
              </button>
              <button
                onClick={() => {
                  setAdding(false);
                  setValue('');
                }}
                aria-label="Close add card"
                className="text-gray-300 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add a card
          </button>
        )}
      </div>
    </div>
  );
}

function DropLine({ show }: { show: boolean }) {
  return (
    <div
      aria-hidden
      className={`h-0.5 rounded-full bg-white transition-all ${
        show ? 'opacity-100 my-1.5' : 'opacity-0 h-0 my-0'
      }`}
    />
  );
}
