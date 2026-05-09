'use server'

import { PrismaClient } from '@prisma/client'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getTasks(listId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      listId: listId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return tasks
}

export async function createTask(title: string, listId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const task = await prisma.task.create({
    data: {
      title,
      userId: user.id,
      listId,
    },
  })

  revalidatePath('/')
  return task
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  await prisma.task.deleteMany({
    where: {
      id: taskId,
      userId: user.id, // Ensure user can only delete their own tasks
    },
  })

  revalidatePath('/')
}
