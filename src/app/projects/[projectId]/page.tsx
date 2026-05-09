'use client';

import { use } from 'react';
import ProjectBoard from '@/components/ProjectBoard';

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  return <ProjectBoard projectId={projectId} />;
}
