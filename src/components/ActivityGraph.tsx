import GlassCard from './GlassCard';

type DayData = {
  day: string;
  previous: number; // 0-100 percentage
  current: number;  // 0-100 percentage
};

const defaultData: DayData[] = [
  { day: 'MON', previous: 66, current: 50 },
  { day: 'TUE', previous: 75, current: 100 },
  { day: 'WED', previous: 50, current: 66 },
  { day: 'THU', previous: 100, current: 80 },
  { day: 'FRI', previous: 80, current: 100 },
  { day: 'SAT', previous: 33, current: 25 },
  { day: 'SUN', previous: 25, current: 33 },
];

export default function ActivityGraph({ data = defaultData }: { data?: DayData[] }) {
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
        {data.map((item) => (
          <div key={item.day} className="flex-grow flex flex-col items-center gap-2">
            <div className="w-full flex items-end gap-1 h-32">
              <div 
                className="bg-white/10 w-full rounded-t-sm transition-all duration-500" 
                style={{ height: `${item.previous}%` }}
              ></div>
              <div 
                className="bg-white w-full rounded-t-sm transition-all duration-500" 
                style={{ height: `${item.current}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-gray-500">{item.day}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
