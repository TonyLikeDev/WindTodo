import PieChart from '@/components/PieChart';
import TaskList from '@/components/TaskList';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <PieChart />
      <TaskList 
        title="Your Tasks" 
        listId="your_tasks"
        placeholder="Add a task..." 
      />
      <TaskList 
        title="Active Projects" 
        listId="active_projects"
        placeholder="Add a project..." 
      />
    </div>
  );
}

