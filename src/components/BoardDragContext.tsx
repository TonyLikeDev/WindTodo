'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

export type DraggableTask = {
  id: string;
  title: string;
  listId: string;
  userId: string;
  position: number;
  createdAt: Date;
};

export type DropSlot = { listId: string; index: number };

export type DropTargetHandle = {
  el: HTMLElement;
  getDropSlot: (clientX: number, clientY: number) => DropSlot;
};

type DragState = {
  task: DraggableTask;
  sourceListId: string;
  pos: { x: number; y: number };
  pointerOffset: { x: number; y: number };
  width: number;
  height: number;
};

type Ctx = {
  registerDropTarget: (listId: string, handle: DropTargetHandle | null) => void;
  startDrag: (
    task: DraggableTask,
    event: React.PointerEvent,
    sourceListId: string,
  ) => void;
  draggingTaskId: string | null;
  hoveredSlot: DropSlot | null;
};

const BoardDragContext = createContext<Ctx | null>(null);

export function useBoardDrag() {
  const ctx = useContext(BoardDragContext);
  if (!ctx) throw new Error('useBoardDrag must be used inside BoardDragProvider');
  return ctx;
}

export function BoardDragProvider({
  children,
  onDrop,
}: {
  children: ReactNode;
  onDrop: (
    task: DraggableTask,
    sourceListId: string,
    targetListId: string,
    targetIndex: number,
  ) => void;
}) {
  const targetsRef = useRef<Map<string, DropTargetHandle>>(new Map());
  const [drag, setDrag] = useState<DragState | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<DropSlot | null>(null);

  const registerDropTarget = useCallback(
    (listId: string, handle: DropTargetHandle | null) => {
      if (handle) targetsRef.current.set(listId, handle);
      else targetsRef.current.delete(listId);
    },
    [],
  );

  const findSlotAt = useCallback(
    (x: number, y: number): DropSlot | null => {
      for (const handle of targetsRef.current.values()) {
        const rect = handle.el.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          return handle.getDropSlot(x, y);
        }
      }
      return null;
    },
    [],
  );

  const startDrag = useCallback(
    (
      task: DraggableTask,
      event: React.PointerEvent,
      sourceListId: string,
    ) => {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      const initialDragState = {
        task,
        sourceListId,
        pos: { x: startX, y: startY },
        pointerOffset: {
          x: startX - rect.left,
          y: startY - rect.top,
        },
        width: rect.width,
        height: rect.height,
      };

      let isDragging = false;

      const onMove = (e: PointerEvent) => {
        if (!isDragging) {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            isDragging = true;
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'grabbing';
            setDrag(initialDragState);
            setHoveredSlot(findSlotAt(e.clientX, e.clientY));
          }
        } else {
          setDrag((prev) =>
            prev ? { ...prev, pos: { x: e.clientX, y: e.clientY } } : prev,
          );
          setHoveredSlot(findSlotAt(e.clientX, e.clientY));
        }
      };

      const finish = (e: PointerEvent) => {
        if (isDragging) {
          const slot = findSlotAt(e.clientX, e.clientY);
          if (slot) {
            onDrop(task, sourceListId, slot.listId, slot.index);
          }
          // Prevent the click event that fires immediately after pointerup from opening the modal
          const captureClick = (ev: MouseEvent) => {
            ev.stopPropagation();
            ev.preventDefault();
          };
          window.addEventListener('click', captureClick, { capture: true, once: true });
          setTimeout(() => window.removeEventListener('click', captureClick, { capture: true }), 0);
        }
        cleanup();
      };

      const cancel = () => cleanup();

      const cleanup = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', finish);
        window.removeEventListener('pointercancel', cancel);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        setDrag(null);
        setHoveredSlot(null);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', finish);
      window.addEventListener('pointercancel', cancel);
    },
    [findSlotAt, onDrop],
  );

  return (
    <BoardDragContext.Provider
      value={{
        registerDropTarget,
        startDrag,
        draggingTaskId: drag?.task.id ?? null,
        hoveredSlot,
      }}
    >
      {children}
      {drag && (
        <div
          className="pointer-events-none fixed z-[200] bg-white/15 backdrop-blur border border-white/25 rounded-lg px-3 py-2 text-sm text-white shadow-2xl"
          style={{
            left: drag.pos.x - drag.pointerOffset.x,
            top: drag.pos.y - drag.pointerOffset.y,
            width: drag.width,
            transform: 'rotate(5deg)',
            transformOrigin: 'top left',
          }}
        >
          <span className="break-words">{drag.task.title}</span>
        </div>
      )}
    </BoardDragContext.Provider>
  );
}
