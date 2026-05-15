'use server';

import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { syncUser } from './userActions';

export async function getOverallStats() {
  const user = await syncUser();
  if (!user) return null;

  const projectWhere: Prisma.ProjectWhereInput = {
    OR: [
      { userId: user.id },
      { members: { some: { id: user.id } } },
    ],
  };

  const [totalProjects, statusCounts] = await Promise.all([
    prisma.project.count({ where: projectWhere }),
    prisma.task.groupBy({
      by: ['status'],
      where: { list: { project: projectWhere } },
      _count: { _all: true },
    }),
  ]);

  const byStatus: Record<string, number> = Object.fromEntries(
    statusCounts.map((row) => [row.status, row._count?._all ?? 0])
  );
  const completedTasks = byStatus.DONE ?? 0;
  const inProgressTasks = byStatus.IN_PROGRESS ?? 0;
  const todoTasks = byStatus.TODO ?? 0;
  const totalTasks = completedTasks + inProgressTasks + todoTasks;

  return {
    totalProjects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    pendingTasks: totalTasks - completedTasks,
  };
}

export async function getProjectStats(projectId: string) {
  const user = await syncUser();
  if (!user) return null;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  if (!project) return null;

  const [statusCounts, unassignedCount, perMember] = await Promise.all([
    prisma.task.groupBy({
      by: ['status'],
      where: { list: { projectId } },
      _count: { _all: true },
    }),
    prisma.task.count({
      where: { list: { projectId }, assigneeId: null },
    }),
    prisma.task.groupBy({
      by: ['assigneeId', 'status'],
      where: { list: { projectId }, assigneeId: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const byStatus: Record<string, number> = Object.fromEntries(
    statusCounts.map((row) => [row.status, row._count?._all ?? 0])
  );
  const completedTasks  = byStatus.DONE ?? 0;
  const inProgressTasks = byStatus.IN_PROGRESS ?? 0;
  const todoTasks       = byStatus.TODO ?? 0;
  const totalTasks      = completedTasks + inProgressTasks + todoTasks;

  const memberAgg = new Map<string, { total: number; done: number; inProg: number; todo: number }>();
  for (const row of perMember) {
    const id = row.assigneeId!;
    const entry = memberAgg.get(id) ?? { total: 0, done: 0, inProg: 0, todo: 0 };
    const n = row._count?._all ?? 0;
    entry.total += n;
    if (row.status === 'DONE') entry.done += n;
    else if (row.status === 'IN_PROGRESS') entry.inProg += n;
    else if (row.status === 'TODO') entry.todo += n;
    memberAgg.set(id, entry);
  }

  const userStats = project.members.map((member, idx) => {
    const agg = memberAgg.get(member.id) ?? { total: 0, done: 0, inProg: 0, todo: 0 };
    const completionPct   = agg.total      > 0 ? Math.round((agg.done / agg.total) * 100) : 0;
    const contributionPct = totalTasks     > 0 ? Math.round((agg.total / totalTasks) * 100) : 0;

    return {
      id:              member.id,
      name:            member.name || member.email.split('@')[0],
      email:           member.email,
      avatarUrl:       member.avatarUrl,
      rank:            idx + 1,
      total:           agg.total,
      completed:       agg.done,
      inProgress:      agg.inProg,
      todo:            agg.todo,
      completionPct,
      contributionPct,
    };
  });

  userStats.sort((a, b) => b.completionPct - a.completionPct || b.total - a.total);

  return {
    projectName: project.name,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    unassignedCount,
    userStats,
  };
}
