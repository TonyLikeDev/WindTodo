'use server';

import { cache } from 'react';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
};

/**
 * Fast auth check: verifies the JWT locally via cached JWKS — no HTTP
 * roundtrip to Supabase Auth and no DB call. Use this for hot paths that just
 * need `user.id`.
 */
export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;
  const c = data.claims;
  if (!c.sub || !c.email) return null;
  const meta = (c.user_metadata ?? {}) as { full_name?: string; avatar_url?: string };
  return {
    id: c.sub,
    email: c.email,
    name: meta.full_name || c.email.split('@')[0],
    avatarUrl: meta.avatar_url ?? null,
  };
});

// Track which user ids we've already synced to Postgres in this server
// instance. Resets on cold start. Keeps the full DB sync to at most once per
// cold function lifetime.
const syncedIds = new Set<string>();

/**
 * Full sync: ensures the Postgres `User` row matches the JWT, and migrates a
 * pending placeholder row keyed by email on first real sign-in. Idempotent and
 * skipped for ids already synced in this server instance.
 */
export const syncUser = cache(async (): Promise<AuthUser | null> => {
  const u = await getAuthUser();
  if (!u) return null;
  if (syncedIds.has(u.id)) return u;

  const byId = await prisma.user.findUnique({ where: { id: u.id } });
  if (byId) {
    if (byId.email !== u.email || byId.name !== u.name || byId.avatarUrl !== u.avatarUrl) {
      await prisma.user.update({
        where: { id: u.id },
        data: { email: u.email, name: u.name, avatarUrl: u.avatarUrl },
      });
    }
    syncedIds.add(u.id);
    return u;
  }

  // No row by id yet — see if there's a pending placeholder keyed by email.
  const pending = await prisma.user.findUnique({ where: { email: u.email } });
  if (pending && pending.id.startsWith('pending:')) {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: pending.id },
        data: { email: `pending-migrating:${pending.id}` },
      });
      await tx.user.create({
        data: { id: u.id, email: u.email, name: u.name, avatarUrl: u.avatarUrl },
      });
      await tx.task.updateMany({ where: { userId: pending.id }, data: { userId: u.id } });
      await tx.task.updateMany({ where: { assigneeId: pending.id }, data: { assigneeId: u.id } });
      await tx.project.updateMany({ where: { userId: pending.id }, data: { userId: u.id } });
      await tx.boardList.updateMany({ where: { userId: pending.id }, data: { userId: u.id } });
      const memberProjects = await tx.project.findMany({
        where: { members: { some: { id: pending.id } } },
        select: { id: true },
      });
      for (const p of memberProjects) {
        await tx.project.update({
          where: { id: p.id },
          data: { members: { disconnect: { id: pending.id }, connect: { id: u.id } } },
        });
      }
      await tx.user.delete({ where: { id: pending.id } });
    });
  } else {
    await prisma.user.create({
      data: { id: u.id, email: u.email, name: u.name, avatarUrl: u.avatarUrl },
    });
  }

  syncedIds.add(u.id);
  return u;
});

export async function getAllUsers() {
  const me = await getAuthUser();
  if (!me) return [];
  return prisma.user.findMany({
    orderBy: { name: 'asc' },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function addUserByEmail(emailRaw: string) {
  const me = await syncUser();
  if (!me) return { ok: false as const, error: 'Unauthorized' };
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
  const me = await getAuthUser();
  if (!me) return [];
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: me.id },
        { members: { some: { id: me.id } } },
      ],
    },
    include: { members: true },
  });
  return project?.members || [];
}

export async function addMemberToProject(projectId: string, userId: string) {
  const me = await syncUser();
  if (!me) throw new Error('Unauthorized');
  // Only the project creator can manage membership.
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: me.id },
    select: { id: true },
  });
  if (!project) throw new Error('Not authorized to manage this project');

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
  const me = await syncUser();
  if (!me) throw new Error('Unauthorized');
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: me.id },
    select: { id: true },
  });
  if (!project) throw new Error('Not authorized to manage this project');

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
