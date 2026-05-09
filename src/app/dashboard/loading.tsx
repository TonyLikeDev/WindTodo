import GlassCard from '@/components/GlassCard';

export default function DashboardLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Pie Chart Skeleton */}
      <GlassCard className="flex flex-col items-center justify-center min-h-[300px] animate-pulse">
        <div className="w-48 h-48 rounded-full border-4 border-white/5 bg-white/5 mb-8"></div>
        <div className="flex gap-4 w-full justify-center">
          <div className="w-12 h-2 bg-white/10 rounded"></div>
          <div className="w-12 h-2 bg-white/10 rounded"></div>
          <div className="w-12 h-2 bg-white/10 rounded"></div>
        </div>
      </GlassCard>

      {/* Task List Skeleton 1 */}
      <GlassCard className="flex flex-col h-full min-h-[300px] animate-pulse">
        <div className="flex justify-between mb-6">
          <div className="w-24 h-4 bg-white/10 rounded"></div>
          <div className="w-6 h-4 bg-white/10 rounded-full"></div>
        </div>
        <div className="space-y-3 flex-grow">
          <div className="w-full h-12 bg-white/5 rounded-lg"></div>
          <div className="w-full h-12 bg-white/5 rounded-lg"></div>
        </div>
        <div className="w-full h-10 bg-white/10 rounded-lg mt-6"></div>
      </GlassCard>

      {/* Task List Skeleton 2 */}
      <GlassCard className="flex flex-col h-full min-h-[300px] animate-pulse">
        <div className="flex justify-between mb-6">
          <div className="w-32 h-4 bg-white/10 rounded"></div>
          <div className="w-6 h-4 bg-white/10 rounded-full"></div>
        </div>
        <div className="space-y-3 flex-grow">
          <div className="w-full h-12 bg-white/5 rounded-lg"></div>
          <div className="w-full h-12 bg-white/5 rounded-lg"></div>
        </div>
        <div className="w-full h-10 bg-white/10 rounded-lg mt-6"></div>
      </GlassCard>
    </div>
  );
}