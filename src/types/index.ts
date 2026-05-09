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

export type Task = {
  id: string;
  title: string;
  time?: string;
  status?: TaskStatus;
  assignee?: User;
  description?: string;
  tags?: string[]; // Array of tag IDs
  checklist?: ChecklistItem[];
};
