import StatsDashboard from '@/components/StatsDashboard';

export const metadata = {
  title: 'Team Statistics | WindTodo',
  description: 'Track team productivity, project contributions, and workflow insights.',
};

export default function StatisticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Team Insights</h1>
          <p className="text-gray-500 text-sm mt-1">Analytics and contribution breakdown for your workspace</p>
        </div>
      </div>
      
      <StatsDashboard />
    </div>
  );
}
