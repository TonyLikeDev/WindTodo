import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#121212]/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Outer blurred glow */}
          <div className="absolute inset-0 bg-[#f26522] rounded-full blur-xl opacity-20 animate-pulse"></div>
          
          {/* Outer track */}
          <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
          
          {/* Spinning rings */}
          <div className="absolute inset-0 border-4 border-transparent border-t-[#f26522] border-r-[#f26522]/50 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-b-blue-500 border-l-blue-500/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Inner dot */}
          <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-white text-base font-medium tracking-widest animate-pulse uppercase">
            Loading
          </p>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-[#f26522] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-[#f26522] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-[#f26522] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
