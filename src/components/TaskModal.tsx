'use client';

import { useState } from 'react';
import { Task, ChecklistItem, User } from '../types';
import { predefinedTags } from '../data/tags';
import { mockUsers } from '../data/users';
import { X, AlignLeft, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
}

export default function TaskModal({ task, onClose, onUpdateTask }: TaskModalProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask({ ...editedTask, title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTask({ ...editedTask, description: e.target.value });
  };

  const toggleTag = (tagId: string) => {
    const currentTags = editedTask.tags || [];
    if (currentTags.includes(tagId)) {
      setEditedTask({ ...editedTask, tags: currentTags.filter(id => id !== tagId) });
    } else {
      setEditedTask({ ...editedTask, tags: [...currentTags, tagId] });
    }
  };

  const handleAddChecklist = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = { id: Date.now().toString(), text: newChecklistItem.trim(), completed: false };
      setEditedTask({ ...editedTask, checklist: [...(editedTask.checklist || []), newItem] });
      setNewChecklistItem('');
    }
  };

  const toggleChecklist = (id: string) => {
    const updatedChecklist = (editedTask.checklist || []).map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setEditedTask({ ...editedTask, checklist: updatedChecklist });
  };

  const removeChecklist = (id: string) => {
    setEditedTask({ ...editedTask, checklist: (editedTask.checklist || []).filter(item => item.id !== id) });
  };

  const handleSave = () => {
    onUpdateTask(editedTask);
    onClose();
  };

  const completedChecklistCount = (editedTask.checklist || []).filter(item => item.completed).length;
  const totalChecklistCount = (editedTask.checklist || []).length;
  const progressPercent = totalChecklistCount === 0 ? 0 : Math.round((completedChecklistCount / totalChecklistCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative z-10"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <input 
            type="text" 
            value={editedTask.title} 
            onChange={handleTitleChange}
            className="text-xl font-bold bg-transparent border-none text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 rounded px-2 py-1 w-3/4"
          />
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-8">
          
          {/* Metadata Row: Status, Time, Assignee */}
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Status</div>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 capitalize">
                {editedTask.status || 'todo'}
              </span>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Assignee</div>
              <div className="relative">
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors">
                  {editedTask.assignee ? (
                    <><div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold text-white">{editedTask.assignee.avatar}</div> {editedTask.assignee.name}</>
                  ) : (
                    <>Unassigned</>
                  )}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
                    <button onClick={() => { setEditedTask({ ...editedTask, assignee: undefined }); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-white/5">Unassigned</button>
                    {mockUsers.map(user => (
                      <button key={user.id} onClick={() => { setEditedTask({ ...editedTask, assignee: user }); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold">{user.avatar}</div> {user.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Priority</div>
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
                {(['low', 'medium', 'high', 'urgent'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setEditedTask({ ...editedTask, priority: p })}
                    className={`px-3 py-1 text-xs rounded-md capitalize transition-colors ${editedTask.priority === p ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Due Date</div>
              <input 
                type="datetime-local" 
                value={editedTask.dueDate || editedTask.time || ''} 
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value, time: e.target.value })}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.6]"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="text-xs text-gray-500 uppercase font-semibold mb-3">Labels / Tags</div>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map(tag => {
                const isActive = (editedTask.tags || []).includes(tag.id);
                return (
                  <button 
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-md text-xs font-medium border transition-all ${isActive ? tag.color + ' ring-1 ring-white/20' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'}`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="text-xs text-gray-500 uppercase font-semibold mb-3 flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              Description
            </div>
            <textarea 
              value={editedTask.description || ''} 
              onChange={handleDescriptionChange}
              placeholder="Add a more detailed description..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 custom-scrollbar resize-none"
            />
          </div>

          {/* Checklist */}
          <div>
            <div className="text-xs text-gray-500 uppercase font-semibold mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Checklist
              </div>
              {totalChecklistCount > 0 && <span className="text-cyan-400 font-mono">{progressPercent}%</span>}
            </div>
            
            {totalChecklistCount > 0 && (
              <div className="h-1.5 w-full bg-white/5 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
              </div>
            )}

            <div className="space-y-2 mb-3">
              {(editedTask.checklist || []).map(item => (
                <div key={item.id} className="flex items-start gap-3 group">
                  <input 
                    type="checkbox" 
                    checked={item.completed} 
                    onChange={() => toggleChecklist(item.id)}
                    className="mt-1 bg-white/5 border-white/20 rounded focus:ring-cyan-500/50 text-cyan-500"
                  />
                  <span className={`text-sm flex-grow ${item.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>{item.text}</span>
                  <button onClick={() => removeChecklist(item.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={newChecklistItem} 
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddChecklist(); }}
                placeholder="Add an item..."
                className="flex-grow bg-transparent border-b border-white/10 px-2 py-1 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
              />
              <button onClick={handleAddChecklist} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-xs font-medium transition-colors">Add</button>
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex justify-end gap-3 bg-black/20">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.15)]">Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
}
