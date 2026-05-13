'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function syncUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email!,
      name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatarUrl: user.user_metadata?.avatar_url || null,
    },
    create: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatarUrl: user.user_metadata?.avatar_url || null,
    },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    orderBy: { name: 'asc' },
  });
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
