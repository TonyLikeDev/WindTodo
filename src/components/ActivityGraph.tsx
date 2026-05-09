import GlassCard from './GlassCard';

export default function ActivityGraph() {
  return (
    <GlassCard className="lg:col-span-3">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Weekly Productivity
        </h3>
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1 text-xs text-gray-500">
            <span className="w-3 h-3 bg-white/20 rounded-sm"></span>
            <span>Previous</span>
          </span>
          <span className="flex items-center space-x-1 text-xs text-white">
            <span className="w-3 h-3 bg-white rounded-sm"></span>
            <span>Current</span>
          </span>
        </div>
      </div>
      <div className="h-48 flex items-end justify-between px-2 gap-4">
        {/* Monday */}
        <div className="flex-grow flex flex-col items-center gap-2">
          <div className="w-full flex items-end gap-1 h-32">
            <div className="bg-white/10 w-full h-2/3 rounded-t-sm"></div>
            <div className="bg-white w-full h-1/2 rounded-t-sm"></div>
          </div>
          <span className="text-[10px] text-gray-500">MON</span>
        </div>
        {/* Tuesday */}
        <div className="flex-grow flex flex-col items-center gap-2">
          <div className="w-full flex items-end gap-1 h-32">
            <div className="bg-white/10 w-full h-3/4 rounded-t-sm"></div>
            <div className="bg-white w-full h-full rounded-t-sm"></div>
          </div>
          <span className="text-[10px] text-gray-500">TUE</span>
        </div>
        {/* Wednesday */}
        <div className="flex-grow flex flex-col items-center gap-2">
          <div className="w-full flex items-end gap-1 h-32">
            <div className="bg-white/10 w-full h-1/2 rounded-t-sm"></div>
            <div className="bg-white w-full h-2/3 rounded-t-sm"></div>
          </div>
          <span className="text-[10px] text-gray-500">WED</span>
        </div>
        {/* Thursday */}
        <div className="flex-grow flex flex-col items-center gap-2">
          <div className="w-full flex items-end gap-1 h-32">
            <div className="bg-white/10 w-full h-full rounded-t-sm"></div>
            <div className="bg-white w-full h-4/5 rounded-t-sm"></div>
          </div>
          <span className="text-[10px] text-gray-500">THU</span>
        </div>
        {/* Friday */}
        <div className="flex-grow flex flex-col items-center gap-2">
          <div className="w-full flex items-end gap-1 h-32">
            <div className="bg-white/10 w-full h-4/5 rounded-t-sm"></div>
            <div className="bg-white w-full h-full rounded-t-sm"></div>
          </div>
          <span className="text-[10px] text-gray-500">FRI</span>
        </div>
        {/* Saturday */}
        <div className="flex-grow flex flex-col items-center gap-2">
          <div className="w-full flex items-end gap-1 h-32">
            <div className="bg-white/10 w-full h-1/3 rounded-t-sm"></div>
            <div className="bg-white w-full h-1/4 rounded-t-sm"></div>
          </div>
          <span className="text-[10px] text-gray-500">SAT</span>
        </div>
        {/* Sunday */}
        <div className="flex-grow flex flex-col items-center gap-2">
          <div className="w-full flex items-end gap-1 h-32">
            <div className="bg-white/10 w-full h-1/4 rounded-t-sm"></div>
            <div className="bg-white w-full h-1/3 rounded-t-sm"></div>
          </div>
          <span className="text-[10px] text-gray-500">SUN</span>
        </div>
      </div>
    </GlassCard>
  );
}
