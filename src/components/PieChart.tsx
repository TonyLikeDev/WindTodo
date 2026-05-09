import GlassCard from './GlassCard';

type PieSegment = {
  label: string;
  percentage: number;
  color: string;
};

const defaultData: PieSegment[] = [
  { label: 'Done', percentage: 40, color: '#ffffff' },
  { label: 'In Progress', percentage: 25, color: '#888888' },
  { label: 'Pending', percentage: 35, color: '#444444' },
];

export default function PieChart({ data = defaultData, totalComplete = 84 }: { data?: PieSegment[], totalComplete?: number }) {
  // Calculate dash offsets based on percentages using reduce to avoid mutation
  const segmentsWithOffsets = data.reduce<{ offsets: (PieSegment & { dasharray: string, dashoffset: number })[], current: number }>(
    (acc, segment) => {
      const dasharray = `${segment.percentage} 100`;
      const dashoffset = -acc.current;
      acc.offsets.push({ ...segment, dasharray, dashoffset });
      acc.current += segment.percentage;
      return acc;
    },
    { offsets: [], current: 0 }
  ).offsets;

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
          {/* Data Segments */}
          {segmentsWithOffsets.map((segment, index) => (
            <circle
              key={index}
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke={segment.color}
              strokeWidth="4"
              strokeDasharray={segment.dasharray}
              strokeDashoffset={segment.dashoffset}
              className="transition-all duration-1000 ease-out"
            ></circle>
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-white">{totalComplete}%</span>
          <span className="text-[10px] text-gray-500 uppercase">Complete</span>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4 w-full">
        {data.map((segment, index) => (
          <div key={index} className="text-center">
            <div 
              className="w-2 h-2 rounded-full mx-auto mb-1" 
              style={{ backgroundColor: segment.color }}
            ></div>
            <span className="text-[10px] text-gray-500">{segment.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
