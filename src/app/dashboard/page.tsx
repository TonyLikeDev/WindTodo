import { syncUser } from '@/app/actions/userActions';
import ProjectsSection from '@/components/ProjectsSection';
import TaskList from '@/components/TaskList';
import WelcomeWidget, { OverviewKPI } from '@/components/DashboardOverview';
import { getOverallStats } from '@/app/actions/statsActions';
import Link from 'next/link';
import { ArrowRight, BarChart2, Plus, Zap } from 'lucide-react';

export default async function Dashboard() {
  const user = await syncUser();
  const stats = await getOverallStats();

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 px-4 md:px-8" suppressHydrationWarning>
      {/* 1. Hero Section */}
      <section>
        <WelcomeWidget userName={user?.name || 'Member'} stats={stats} />
      </section>

      {/* 2. Key Metrics */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-1.5 h-6 bg-white rounded-full" />
          <h2 className="text-xl font-bold text-white tracking-tight">Market Overview</h2>
        </div>
        <OverviewKPI stats={stats} />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* 3. Main Content: Projects Grid */}
        <div className="xl:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <h2 className="text-2xl font-black text-white tracking-tight">Active Projects</h2>
              </div>
              <p className="text-sm text-gray-500">Your currently active workspace boards and team collaborations</p>
            </div>
            <div className="flex items-center gap-3">
               <Link 
                 href="/dashboard/stats" 
                 className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all"
               >
                 <BarChart2 className="w-4 h-4" />
                 Analytics
               </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <ProjectsSection />
          </div>
        </div>

        {/* 4. Side Content: Tasks & Activity */}
        <div className="xl:col-span-4 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] opacity-40">Quick Tasks</h3>
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <TaskList 
                title="" 
                listId="recent_assignments" 
                placeholder="What's on your mind?" 
              />
            </div>
          </section>

          {/* Productivity Tip Card */}
          <div className="glass rounded-[2rem] p-8 border border-white/5 bg-gradient-to-br from-yellow-500/[0.05] to-transparent relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-colors" />
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Zap className="w-5 h-5 fill-yellow-500" />
              </div>
              <h4 className="text-lg font-bold text-white">Pro Tip</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Break your large tasks into smaller sub-tasks to maintain flow and hit your daily goals faster.
              </p>
              <Link href="/dashboard/stats" className="inline-flex items-center gap-2 text-xs font-bold text-yellow-500/80 hover:text-yellow-500 transition-colors">
                Analyze your workflow <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
