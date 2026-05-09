import PieChart from '@/components/PieChart';
import TaskList from '@/components/TaskList';
import ProjectsSection from '@/components/ProjectsSection';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PieChart />
        <TaskList
          title="Your Tasks"
          listId="your_tasks"
          placeholder="Add a task..."
        />
        <TaskList
          title="Active Tasks"
          listId="active_tasks"
          placeholder="Add a task..."
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white tracking-tight">Projects</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProjectsSection />
        </div>
      </section>
    </div>
  );
}
