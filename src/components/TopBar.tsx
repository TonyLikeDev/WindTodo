"use client";

import { useState, useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useThemeStore } from '../store/useThemeStore';
import { Palette, Check } from 'lucide-react';

const THEMES = [
  { id: 'cyan', name: 'Cyan', bgClass: 'bg-cyan-500' },
  { id: 'purple', name: 'Purple', bgClass: 'bg-purple-500' },
  { id: 'green', name: 'Green', bgClass: 'bg-green-500' },
  { id: 'red', name: 'Red', bgClass: 'bg-red-500' },
  { id: 'orange', name: 'Orange', bgClass: 'bg-orange-500' },
  { id: 'pink', name: 'Pink', bgClass: 'bg-pink-500' },
];

export default function TopBar() {
  const [currentDate, setCurrentDate] = useState({ date: '', day: '' });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const setSearchOpen = useTaskStore(state => state.setSearchOpen);
  const { accentColor, setAccentColor } = useThemeStore();

  useEffect(() => {
    const formatDate = () => {
      const now = new Date();
      const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
      const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
      
      setCurrentDate({
        date: now.toLocaleDateString('en-US', dateOptions),
        day: now.toLocaleDateString('en-US', dayOptions)
      });
    };

    formatDate();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/10 backdrop-blur-lg relative z-50">
        <div className="relative w-96 hidden sm:block">
            <button 
              onClick={() => setSearchOpen(true)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-500 text-left hover:bg-white/10 transition-all flex items-center group"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              Search tasks, actions...
              <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                <span className="font-sans">⌘</span>K
              </span>
            </button>
        </div>
        
        <div className="flex items-center space-x-6 ml-auto">
            <button 
              className="relative text-gray-400 hover:text-white transition-colors"
              onClick={() => alert('You have no new notifications.')}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full"></span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="text-gray-400 hover:text-accent-400 transition-colors p-1"
                title="Change Theme"
              >
                <Palette className="w-5 h-5" />
              </button>
              
              {isThemeMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Accent Color</div>
                  <div className="space-y-1">
                    {THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setAccentColor(theme.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors ${accentColor === theme.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${theme.bgClass}`}></span>
                          {theme.name}
                        </div>
                        {accentColor === theme.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center space-x-3">
                <div className="text-right">
                    <p className="text-xs font-medium text-white">{currentDate.date}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{currentDate.day}</p>
                </div>
            </div>
        </div>
    </header>
  );
}