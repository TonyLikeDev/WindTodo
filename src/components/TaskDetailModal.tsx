'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { getTaskDetails, updateTaskDetails, addComment } from '@/app/actions/taskDetailActions';
import { X, AlignLeft, MessageSquare, Clock, Plus, Tag, CheckSquare, Paperclip, Activity } from 'lucide-react';
import { format, isPast } from 'date-fns';

interface TaskDetailModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
  listName?: string;
}

export default function TaskDetailModal({ taskId, isOpen, onClose, listName }: TaskDetailModalProps) {
  const { data: task, mutate, isLoading } = useSWR(
    isOpen ? `task-${taskId}` : null,
    () => getTaskDetails(taskId)
  );

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState('');
  const [commentValue, setCommentValue] = useState('');

  useEffect(() => {
    if (task) {
      setDescValue(task.description || '');
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSaveDesc = async () => {
    await updateTaskDetails(taskId, { description: descValue });
    mutate();
    setIsEditingDesc(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentValue.trim()) return;
    const oldComment = commentValue;
    setCommentValue('');
    await addComment(taskId, oldComment);
    mutate();
  };

  const handleSetDueDate = async () => {
    // Just a placeholder toggling 1 day ahead
    const date = new Date();
    date.setDate(date.getDate() + 1);
    await updateTaskDetails(taskId, { dueDate: date });
    mutate();
  };

  if (isLoading || !task) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-[#1f1f1f] w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh] animate-pulse">
          <div className="flex items-start justify-between p-5 border-b border-white/5">
            <div className="flex gap-3 w-full">
              <div className="w-6 h-6 bg-white/10 rounded mt-1"></div>
              <div className="space-y-2 w-1/3">
                <div className="h-6 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <div className="flex-1 p-6 border-r border-white/5 space-y-8">
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-white/10 rounded"></div>
                <div className="h-8 w-20 bg-white/10 rounded"></div>
                <div className="h-8 w-24 bg-white/10 rounded"></div>
              </div>
              <div className="flex gap-8">
                <div>
                  <div className="h-4 w-16 bg-white/10 rounded mb-2"></div>
                  <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                </div>
                <div>
                  <div className="h-4 w-20 bg-white/10 rounded mb-2"></div>
                  <div className="h-8 w-32 bg-white/10 rounded"></div>
                </div>
              </div>
              <div>
                <div className="h-6 w-24 bg-white/10 rounded mb-3"></div>
                <div className="space-y-2 ml-8">
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                  <div className="h-4 bg-white/10 rounded w-4/6"></div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-[340px] bg-black/20 p-5 space-y-6">
              <div className="h-6 w-40 bg-white/10 rounded"></div>
              <div className="h-10 w-full bg-white/10 rounded"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-white/10 rounded w-1/2"></div>
                      <div className="h-3 bg-white/10 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#1f1f1f] w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/5">
          <div className="flex gap-3">
            <CheckSquare className="w-6 h-6 text-gray-400 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">{task.title}</h2>
              <p className="text-sm text-gray-400 mt-1">
                in list <span className="underline cursor-pointer">{listName || '...'}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left Column (Details) */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-white/5 space-y-8">
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-sm text-gray-300 transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-sm text-gray-300 transition-colors">
                <Tag className="w-4 h-4" /> Labels
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-sm text-gray-300 transition-colors">
                <CheckSquare className="w-4 h-4" /> Checklist
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-sm text-gray-300 transition-colors">
                <Paperclip className="w-4 h-4" /> Attachment
              </button>
            </div>

            {/* Meta Row (Members, Due Date) */}
            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2">Members</h3>
                <div className="flex items-center gap-1">
                  {task.assignee ? (
                    <div title={task.assignee.name || task.assignee.email} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white border border-white/20">
                      {(task.assignee.name || task.assignee.email).substring(0, 2).toUpperCase()}
                    </div>
                  ) : null}
                  <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2">Due Date</h3>
                <div className="flex items-center gap-2">
                  <button onClick={handleSetDueDate} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-sm text-gray-300 transition-colors">
                    {task.dueDate ? (
                      <>
                        {format(new Date(task.dueDate), 'HH:mm dd MMM, yyyy')}
                        {isOverdue && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded ml-2">Overdue</span>}
                      </>
                    ) : (
                      'Add date'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <AlignLeft className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-200">Description</h3>
                </div>
                {!isEditingDesc && task.description && (
                  <button onClick={() => setIsEditingDesc(true)} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-md text-xs text-gray-300 transition-colors">
                    Edit
                  </button>
                )}
              </div>
              
              <div className="ml-8">
                {isEditingDesc ? (
                  <div className="space-y-2">
                    <textarea 
                      autoFocus
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-y"
                      placeholder="Add a more detailed description..."
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={handleSaveDesc} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors">
                        Save
                      </button>
                      <button onClick={() => setIsEditingDesc(false)} className="px-4 py-1.5 hover:bg-white/10 text-gray-300 text-sm rounded-md transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsEditingDesc(true)}
                    className={`text-sm rounded-lg p-3 cursor-pointer transition-colors ${task.description ? 'text-gray-300' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
                  >
                    {task.description || 'Add a more detailed description...'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Activity & Comments) */}
          <div className="w-full md:w-[340px] bg-black/20 flex flex-col">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-200 font-semibold">
                <MessageSquare className="w-5 h-5" />
                <span>Comments & Activity</span>
              </div>
            </div>

            {/* Comment Input */}
            <div className="p-4 border-b border-white/5">
              <form onSubmit={handleAddComment}>
                <input 
                  type="text"
                  placeholder="Write a comment..."
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
                />
              </form>
            </div>

            {/* Activity Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {task.activities.length === 0 ? (
                <div className="text-center text-gray-500 text-sm mt-10">No activity yet</div>
              ) : (
                task.activities.map((act: any) => (
                  <div key={act.id} className="flex gap-3">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#f26522] flex items-center justify-center text-xs font-bold text-white">
                      {(act.user?.name || act.user?.email || 'U').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">
                        <span className="font-bold text-white mr-1">{act.user?.name || act.user?.email}</span>
                        {act.type === 'comment' ? (
                          <span className="block mt-1 bg-white/10 rounded-lg px-3 py-2 text-white">{act.content}</span>
                        ) : (
                          <span className="text-gray-400">{act.content}</span>
                        )}
                      </p>
                      <p className="text-xs text-blue-400 mt-1">
                        {format(new Date(act.createdAt), 'HH:mm dd MMM, yyyy')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
