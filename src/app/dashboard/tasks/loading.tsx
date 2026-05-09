import GlassCard from '@/components/GlassCard';

export default function TasksLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-24 h-8 bg-white/10 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Task List Skeleton */}
        <GlassCard className="flex flex-col h-full min-h-[400px]">
          <div className="flex justify-between mb-6">
            <div className="w-24 h-4 bg-white/10 rounded"></div>
            <div className="w-6 h-4 bg-white/10 rounded-full"></div>
          </div>
          <div className="space-y-3 flex-grow">
            <div className="w-full h-12 bg-white/5 rounded-lg"></div>
            <div className="w-full h-12 bg-white/5 rounded-lg"></div>
            <div className="w-full h-12 bg-white/5 rounded-lg"></div>
            <div className="w-full h-12 bg-white/5 rounded-lg"></div>
          </div>
          <div className="w-full h-10 bg-white/10 rounded-lg mt-6"></div>
        </GlassCard>

        {/* Info Card Skeleton */}
        <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full mb-4"></div>
            <div className="w-40 h-6 bg-white/10 rounded mb-2"></div>
            <div className="w-64 h-4 bg-white/5 rounded mt-2"></div>
            <div className="w-48 h-4 bg-white/5 rounded mt-2"></div>
        </div>
      </div>
    </div>
  );
}