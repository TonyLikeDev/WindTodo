import PieChart from '@/components/PieChart';
import TaskList from '@/components/TaskList';
import { getTasks } from '@/app/actions/taskActions';

export default async function Dashboard() {
  const yourTasks = await getTasks('your_tasks');
  const activeProjects = await getTasks('active_projects');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <PieChart />
      <TaskList 
        title="Your Tasks" 
        listId="your_tasks"
        tasks={yourTasks} 
        placeholder="Add a task..." 
      />
      <TaskList 
        title="Active Projects" 
        listId="active_projects"
        tasks={activeProjects} 
        placeholder="Add a project..." 
      />
    </div>
  );
}
