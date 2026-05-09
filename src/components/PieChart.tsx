import GlassCard from './GlassCard';

export default function PieChart() {
  return (
    <GlassCard className="flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider self-start">
        Task Distribution
      </h3>
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
          ></circle>
          {/* Data Segments (Grayscale Patterns) */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="transparent"
            stroke="#ffffff"
            strokeWidth="4"
            strokeDasharray="40 100"
            strokeDashoffset="0"
          ></circle>
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="transparent"
            stroke="#888888"
            strokeWidth="4"
            strokeDasharray="25 100"
            strokeDashoffset="-40"
          ></circle>
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="transparent"
            stroke="#444444"
            strokeWidth="4"
            strokeDasharray="35 100"
            strokeDashoffset="-65"
          ></circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-white">84%</span>
          <span className="text-[10px] text-gray-500 uppercase">Complete</span>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4 w-full">
        <div className="text-center">
          <div className="w-2 h-2 bg-white rounded-full mx-auto mb-1"></div>
          <span className="text-[10px] text-gray-500">Done</span>
        </div>
        <div className="text-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto mb-1"></div>
          <span className="text-[10px] text-gray-500">In Progress</span>
        </div>
        <div className="text-center">
          <div className="w-2 h-2 bg-gray-800 rounded-full mx-auto mb-1"></div>
          <span className="text-[10px] text-gray-500">Pending</span>
        </div>
      </div>
    </GlassCard>
  );
}
