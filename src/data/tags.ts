export type Tag = {
  id: string;
  name: string;
  color: string;
};

export const predefinedTags: Tag[] = [
  { id: 'tag1', name: 'Urgent', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'tag2', name: 'Feature', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'tag3', name: 'Bug', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'tag4', name: 'Design', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'tag5', name: 'Documentation', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
];
