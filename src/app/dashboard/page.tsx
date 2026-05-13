<<<<<<< HEAD
import DashboardHeader from '@/components/DashboardHeader';
import MyTasksSection from '@/components/MyTasksSection';
import ProjectsSection from '@/components/ProjectsSection';
import GlassCard from '@/components/GlassCard';
import { Layout } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Top Section: Greeting ────────────────────────────────────── */}
      <DashboardHeader />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* ── Left Column: Personal Focus (2/3) ────────────────────────── */}
        <div className="xl:col-span-2 space-y-8">
          <MyTasksSection />
        </div>

        {/* ── Right Column: Projects & Quick Access (1/3) ─────────────── */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Your Projects
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ProjectsSection />
            </div>
          </section>
        </div>

      </div>
=======
import StatsDashboard from '@/components/StatsDashboard';
import ProjectsSection from '@/components/ProjectsSection';
import TaskList from '@/components/TaskList';

export default function Dashboard() {
  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <section>
        <div className="flex flex-col mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Workspace Overview</h1>
          <p className="text-gray-400 text-sm">Monitor your projects and team productivity in real-time.</p>
        </div>
        <StatsDashboard />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Active Projects</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProjectsSection />
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TaskList 
          title="Recent Assignments" 
          listId="recent_assignments" 
          placeholder="New quick task..." 
        />
        <div className="glass p-8 rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-xl">
             <BarChart2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Focus Mode</h3>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            Concentrate on your most important tasks. Use the project boards to manage detailed workflows.
          </p>
        </div>
      </section>
>>>>>>> 31-make-changes-in-statistic
    </div>
  );
}

import { BarChart2 } from 'lucide-react';
