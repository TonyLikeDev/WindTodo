import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden w-full">
      <header className="flex items-center px-4 py-2.5 border-b border-white/5 bg-black/30 backdrop-blur flex-shrink-0">
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden">
            <Image src="/windtodo.png" alt="WindTodo" width={32} height={32} className="w-full h-full object-contain" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">WindTodo</span>
        </Link>
      </header>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
