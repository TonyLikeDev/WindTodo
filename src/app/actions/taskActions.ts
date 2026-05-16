'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { syncUser } from './userActions'

async function requireUserId() {
  const user = await syncUser()
  if (!user) throw new Error('Unauthorized')
  return user.id
}

export async function getTasks(listId: string) {
  const user = await syncUser()
  if (!user) return []

  if (listId === 'recent_assignments') {
    return prisma.task.findMany({
      where: {
        OR: [
          { assigneeId: user.id },
          { userId: user.id }
        ]
      },
      include: {
        creator: true,
        assignee: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
  }

  if (listId === 'all_tasks') {
    return prisma.task.findMany({
      where: {
        list: {
          project: {
            OR: [
              { userId: user.id },
              { members: { some: { id: user.id } } }
            ]
          }
        }
      },
      include: {
        creator: true,
        assignee: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
  }

  return prisma.task.findMany({
    where: { listId },
    include: {
      creator: true,
      assignee: true,
    },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  })
}

export async function createTask(title: string, listId: string, assigneeId?: string) {
  const userId = await requireUserId()

  const last = await prisma.task.findFirst({
    where: { listId },
    orderBy: { position: 'desc' },
    select: { position: true },
  })

  const task = await prisma.task.create({
    data: {
      title,
      userId,
      listId,
      assigneeId,
      position: (last?.position ?? -1) + 1,
    },
    include: {
      creator: true,
      assignee: true,
    }
  })

  revalidatePath('/')
  return task
}

export async function updateTask(taskId: string, data: { title?: string, assigneeId?: string | null, status?: 'TODO' | 'IN_PROGRESS' | 'DONE' }) {
  const userId = await requireUserId()
  
  const task = await prisma.task.update({
    where: { id: taskId },
    data,
    include: {
      creator: true,
      assignee: true,
    }
  })

  revalidatePath('/')
  return task
}

export async function moveTask(
  taskId: string,
  targetListId: string,
  targetIndex: number,
) {
  const userId = await requireUserId()

  const task = await prisma.task.findFirst({
    where: { id: taskId },
  })
  if (!task) return

  const sourceListId = task.listId

  await prisma.$transaction(async (tx) => {
    if (sourceListId === targetListId) {
      const items = await tx.task.findMany({
        where: { listId: targetListId },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        select: { id: true },
      })
      const without = items.filter((t) => t.id !== taskId)
      const clamped = Math.max(0, Math.min(targetIndex, without.length))
      const next = [
        ...without.slice(0, clamped),
        { id: taskId },
        ...without.slice(clamped),
      ]
      await Promise.all(
        next.map((t, i) =>
          tx.task.update({ where: { id: t.id }, data: { position: i } }),
        ),
      )
    } else {
      const targetItems = await tx.task.findMany({
        where: { listId: targetListId },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        select: { id: true },
      })
      const clamped = Math.max(0, Math.min(targetIndex, targetItems.length))
      const nextTarget = [
        ...targetItems.slice(0, clamped).map((t) => t.id),
        taskId,
        ...targetItems.slice(clamped).map((t) => t.id),
      ]

      await tx.task.update({
        where: { id: taskId },
        data: { listId: targetListId },
      })

      await Promise.all(
        nextTarget.map((id, i) =>
          tx.task.update({ where: { id }, data: { position: i } }),
        ),
      )

      const sourceItems = await tx.task.findMany({
        where: { listId: sourceListId },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        select: { id: true },
      })
      await Promise.all(
        sourceItems.map((t, i) =>
          tx.task.update({ where: { id: t.id }, data: { position: i } }),
        ),
      )
    }
  })

  revalidatePath('/')
}

export async function deleteTask(taskId: string) {
  await requireUserId()
  await prisma.task.deleteMany({
    where: { id: taskId },
  })
  revalidatePath('/')
}
