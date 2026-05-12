'use client';

import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { Tag } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const AVAILABLE_COLORS = [
  'bg-red-500/20 text-red-400 border-red-500/30',
  'bg-green-500/20 text-green-400 border-green-500/30',
  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'bg-accent-500/20 text-accent-400 border-accent-500/30',
  'bg-orange-500/20 text-orange-400 border-orange-500/30',
];

interface TagManagerModalProps {
  onClose: () => void;
}

export default function TagManagerModal({ onClose }: TagManagerModalProps) {
  const { tags, addTag, removeTag } = useTaskStore();
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      color: selectedColor,
    };
    
    addTag(newTag);
    setNewTagName('');
    toast.success('Tag created successfully');
  };

  const handleRemoveTag = (tagId: string) => {
    removeTag(tagId);
    toast('Tag deleted');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
        className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl relative z-10"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Manage Tags</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Add New Tag */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase">Create New Tag</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(); }}
                placeholder="Tag name..."
                className="flex-grow bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-500/50"
              />
              <button 
                onClick={handleAddTag}
                disabled={!newTagName.trim()}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {AVAILABLE_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${color.split(' ')[0]} ${selectedColor === color ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                />
              ))}
            </div>
            
            {/* Preview */}
            <div className="pt-2">
              <span className="text-xs text-gray-500 mr-2">Preview:</span>
              <span className={`px-3 py-1 rounded-md text-xs font-medium border ${selectedColor}`}>
                {newTagName || 'Tag Name'}
              </span>
            </div>
          </div>

          {/* Existing Tags */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase">Existing Tags</label>
            <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 pr-2">
              {tags.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">No tags available.</div>
              ) : (
                tags.map(tag => (
                  <div key={tag.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 group">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium border ${tag.color}`}>
                      {tag.name}
                    </span>
                    <button 
                      onClick={() => handleRemoveTag(tag.id)}
                      className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
