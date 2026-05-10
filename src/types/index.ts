export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type User = {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: string;
  title: string;
  time?: string; // Sẽ deprecate (bỏ dần)
  dueDate?: string; // Thay thế cho time
  createdAt?: string; 
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: User;
  description?: string;
  tags?: string[]; // Array of tag IDs
  checklist?: ChecklistItem[];
  _listName?: string; // Metadata for unified views
};
