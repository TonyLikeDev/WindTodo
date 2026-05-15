'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function syncUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const email = user.email!;
  const name = user.user_metadata.full_name || email.split('@')[0];
  const avatarUrl = user.user_metadata.avatar_url ?? null;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== user.id && existing.id.startsWith('pending:')) {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: existing.id },
        data: { email: `pending-migrating:${existing.id}` },
      });
      await tx.user.create({
        data: { id: user.id, email, name, avatarUrl },
      });
      await tx.task.updateMany({ where: { userId: existing.id }, data: { userId: user.id } });
      await tx.task.updateMany({ where: { assigneeId: existing.id }, data: { assigneeId: user.id } });
      await tx.project.updateMany({ where: { userId: existing.id }, data: { userId: user.id } });
      await tx.boardList.updateMany({ where: { userId: existing.id }, data: { userId: user.id } });
      const memberProjects = await tx.project.findMany({
        where: { members: { some: { id: existing.id } } },
        select: { id: true },
      });
      for (const p of memberProjects) {
        await tx.project.update({
          where: { id: p.id },
          data: {
            members: { disconnect: { id: existing.id }, connect: { id: user.id } },
          },
        });
      }
      await tx.user.delete({ where: { id: existing.id } });
    });
    return prisma.user.findUnique({ where: { id: user.id } });
  }

  return prisma.user.upsert({
    where: { id: user.id },
    update: { email, name, avatarUrl },
    create: { id: user.id, email, name, avatarUrl },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    orderBy: { name: 'asc' },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function addUserByEmail(emailRaw: string) {
  await syncUser();
  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false as const, error: 'Invalid email address' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false as const, error: 'A user with that email already exists' };
  }

  const user = await prisma.user.create({
    data: {
      id: `pending:${crypto.randomUUID()}`,
      email,
      name: email.split('@')[0],
    },
  });
  revalidatePath('/dashboard/users');
  return { ok: true as const, user };
}

export async function getProjectMembers(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  return project?.members || [];
}

export async function addMemberToProject(projectId: string, userId: string) {
  const result = await prisma.project.update({
    where: { id: projectId },
    data: {
      members: {
        connect: { id: userId },
      },
    },
    include: { members: true },
  });
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/dashboard');
  return result;
}

export async function removeMemberFromProject(projectId: string, userId: string) {
  const result = await prisma.project.update({
    where: { id: projectId },
    data: {
      members: {
        disconnect: { id: userId },
      },
    },
    include: { members: true },
  });
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/dashboard');
  return result;
}
