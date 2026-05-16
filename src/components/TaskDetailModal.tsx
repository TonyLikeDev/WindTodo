'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, User, AlignLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { updateTask, deleteTask } from '@/app/actions/taskActions';
import type { Task } from './BoardColumn';





export default function TaskDetailModal({ 
  task, 
  isOpen, 
  onClose, 
  onUpdate,
  members = [] 
}: { 
  task: Task | null; 
  isOpen: boolean; 
  onClose: () => void;
  onUpdate: () => void;
  members: any[];
}) {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('MEDIUM');
  const [dueDate, setDueDate] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setAssigneeId(task.assigneeId || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = async () => {
    setIsSaving(true);
    await updateTask(task.id, {
      title,
      status: task.status,
      assigneeId: assigneeId || null,
    });

    setIsSaving(false);
    onUpdate();
    onClose();
  };

  const handleDelete = async () => {
    if (confirm('Delete this task permanently?')) {
      await deleteTask(task.id);
      onUpdate();
      onClose();
    }
  };

  const priorityColors = {
    LOW: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
    MEDIUM: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    URGENT: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white/5 ${task.status === 'DONE' ? 'text-green-500' : 'text-gray-400'}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Task Details</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDelete} className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8 flex-1">
          {/* Title */}
          <div className="space-y-2">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-2xl font-black text-white placeholder-gray-700 focus:outline-none"
              placeholder="Task Title"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Assignee */}
              <div className="flex items-center gap-4">
                <div className="w-24 flex items-center gap-2 text-gray-500">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Assignee</span>
                </div>
                <select 
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <option value="">Unassigned</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name || m.email}</option>)}
                </select>
              </div>

              {/* Priority */}
              <div className="flex items-center gap-4">
                <div className="w-24 flex items-center gap-2 text-gray-500">
                  <Flag className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Priority</span>
                </div>
                <div className="flex-1 flex gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-black border transition-all ${
                        priority === p ? priorityColors[p] : 'text-gray-600 bg-transparent border-white/5 hover:border-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Due Date */}
              <div className="flex items-center gap-4">
                <div className="w-24 flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Due Date</span>
                </div>
                <input 
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 color-white scheme-dark"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-500">
              <AlignLeft className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Description</span>
            </div>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-white/10 min-h-[150px] resize-none"
              placeholder="Add more details about this task..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-2 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
