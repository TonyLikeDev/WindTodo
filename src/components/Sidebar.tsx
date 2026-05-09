"use client";

import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <aside className="sidebar-glass w-64 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/5">
            <div className="flex items-center space-x-3 mb-10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">WindTodo</span>
            </div>
            
            <nav className="space-y-1">
                <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/5 text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span>Dashboard</span>
                </Link>
                <Link href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    <span>Tasks</span>
                </Link>
                <Link href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                    <span>Statistics</span>
                </Link>
                <Link href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-12 0v1zm0-11a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"></path></svg>
                    <span>Users</span>
                </Link>
            </nav>
        </div>
        
        <div className="mt-auto p-6 relative">
            {isSettingsOpen && (
                <div className="absolute bottom-full left-6 right-6 mb-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-lg overflow-hidden glass z-50">
                    <div className="py-1">
                        <Link href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors">Profile</Link>
                        <Link href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors">Account Settings</Link>
                        <Link href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors">Preferences</Link>
                        <div className="border-t border-white/10 my-1"></div>
                        <Link href="/login" className="block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">Logout</Link>
                    </div>
                </div>
            )}
            <div 
              className="glass rounded-xl p-4 flex items-center space-x-3 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
                <div className="w-10 h-10 rounded-full bg-gray-600 border border-white/10 overflow-hidden">
                    {/* Using standard img to bypass Next.js Image external domain config for mock avatars */}
                    <img src="https://ui-avatars.com/api/?name=Tony+Stark&background=333&color=fff" alt="User" className="w-full h-full" />
                </div>
                <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-white truncate">Tony Stark</p>
                    <p className="text-xs text-gray-500 truncate">Pro Member</p>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(!isSettingsOpen); }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                </button>
            </div>
        </div>
    </aside>
  );
}