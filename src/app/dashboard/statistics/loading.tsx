import GlassCard from '@/components/GlassCard';

export default function StatisticsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-32 h-8 bg-white/10 rounded"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart Skeleton */}
        <GlassCard className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-48 h-48 rounded-full border-4 border-white/5 bg-white/5 mb-8"></div>
        </GlassCard>

        {/* Key Metrics Skeleton */}
        <div className="glass p-6 rounded-2xl">
          <div className="w-32 h-4 bg-white/10 rounded mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="w-32 h-4 bg-white/5 rounded"></div>
                <div className="w-8 h-6 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Graph Skeleton */}
        <GlassCard className="lg:col-span-2 min-h-[250px]">
          <div className="flex items-center justify-between mb-8">
            <div className="w-40 h-4 bg-white/10 rounded"></div>
            <div className="w-24 h-4 bg-white/5 rounded"></div>
          </div>
          <div className="h-48 flex items-end justify-between px-2 gap-4">
             {[1, 2, 3, 4, 5, 6, 7].map((i) => (
               <div key={i} className="flex-grow flex flex-col items-center gap-2">
                 <div className="w-full bg-white/5 rounded-t-sm" style={{ height: `${Math.max(20, (i * 17) % 100)}%` }}></div>
               </div>
             ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}