export default function TopBar() {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/10 backdrop-blur-lg">
        <div className="relative w-96 hidden sm:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input type="text" placeholder="Search tasks, users, analytics..." className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all" />
        </div>
        
        <div className="flex items-center space-x-6 ml-auto">
            <button className="relative text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center space-x-3">
                <div className="text-right">
                    <p className="text-xs font-medium text-white">May 8, 2026</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Friday</p>
                </div>
            </div>
        </div>
    </header>
  );
}