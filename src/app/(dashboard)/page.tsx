import PieChart from '@/components/PieChart';
import TaskList from '@/components/TaskList';

export default function Dashboard() {
  const dailyTasks = [
    { id: '1', title: 'Morning standup meeting' },
    { id: '2', title: 'Review pull requests' },
    { id: '3', title: 'Update documentation' },
  ];

  const activeProjects = [
    { id: '4', title: 'WindTodo V1' },
    { id: '5', title: 'Project Phoenix' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <PieChart />
      <TaskList 
        title="Your Tasks" 
        initialTasks={dailyTasks} 
        placeholder="Add a task..." 
      />
      <TaskList 
        title="Active Projects" 
        initialTasks={activeProjects} 
        placeholder="Add a project..." 
      />
    </div>
  );
}
