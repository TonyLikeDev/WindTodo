"use client";

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import SearchPalette from "@/components/SearchPalette";
import { useTaskStore } from "@/store/useTaskStore";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isSearchOpen = useTaskStore(state => state.isSearchOpen);
  const setSearchOpen = useTaskStore(state => state.setSearchOpen);

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        <TopBar />
        <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
      <SearchPalette isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}