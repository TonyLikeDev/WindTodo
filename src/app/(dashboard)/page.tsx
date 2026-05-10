import TaskList from '@/components/TaskList';
import WelcomeWidget from '@/components/WelcomeWidget';

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
    <div className="flex flex-col h-full space-y-6">
      <WelcomeWidget />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
        <TaskList 
          listId="dashboard-daily"
          title="Daily Tasks" 
          initialTasks={dailyTasks} 
          placeholder="Add a daily task..." 
        />
        <TaskList 
          listId="dashboard-projects"
          title="Active Projects" 
          initialTasks={activeProjects} 
          placeholder="Add a new project or milestone..." 
        />
      </div>
    </div>
  );
}
