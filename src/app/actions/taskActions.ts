'use server'

import { PrismaClient } from '@prisma/client'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

async function requireUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user.id
}

export async function getTasks(listId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  return prisma.task.findMany({
    where: { userId: user.id, listId },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  })
}

export async function createTask(title: string, listId: string) {
  const userId = await requireUserId()

  const last = await prisma.task.findFirst({
    where: { userId, listId },
    orderBy: { position: 'desc' },
    select: { position: true },
  })

  const task = await prisma.task.create({
    data: {
      title,
      userId,
      listId,
      position: (last?.position ?? -1) + 1,
    },
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
    where: { id: taskId, userId },
  })
  if (!task) return

  const sourceListId = task.listId

  await prisma.$transaction(async (tx) => {
    if (sourceListId === targetListId) {
      const items = await tx.task.findMany({
        where: { userId, listId: targetListId },
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
        where: { userId, listId: targetListId },
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
        where: { userId, listId: sourceListId },
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
  const userId = await requireUserId()
  await prisma.task.deleteMany({
    where: { id: taskId, userId },
  })
  revalidatePath('/')
}
