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
    </div>
  );
}
