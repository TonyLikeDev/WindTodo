import PieChart from '@/components/PieChart';
import ActivityGraph from '@/components/ActivityGraph';
import KeyMetricsWidget from '@/components/KeyMetricsWidget';

export default function StatisticsPage() {
  return (
    <div className="space-y-8 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Global Statistics</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <KeyMetricsWidget />
        <PieChart />
      </div>
      
      <div className="mt-8 flex-grow">
        <ActivityGraph />
      </div>
    </div>
  );
}
