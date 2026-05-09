import PieChart from '@/components/PieChart';
import ActivityGraph from '@/components/ActivityGraph';

export default function StatisticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Statistics</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PieChart />
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider">
            Key Metrics
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-sm text-gray-400">Total Tasks Completed</span>
              <span className="text-lg font-bold text-white">124</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-sm text-gray-400">Average Daily Tasks</span>
              <span className="text-lg font-bold text-white">8.2</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-sm text-gray-400">Peak Productivity Day</span>
              <span className="text-lg font-bold text-white">Wednesday</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Active Projects</span>
              <span className="text-lg font-bold text-white">5</span>
            </div>
          </div>
        </div>
        <ActivityGraph />
      </div>
    </div>
  );
}
