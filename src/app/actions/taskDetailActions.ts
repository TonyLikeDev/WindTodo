'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTaskDetails(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      creator: true,
      assignee: true,
      list: {
        include: {
          project: {
            include: {
              members: true,
              creator: true
            }
          }
        }
      },
      activities: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  return task
}

export async function updateTaskDetails(taskId: string, data: { description?: string, dueDate?: Date | null, startDate?: Date | null, reminder?: number | null, assigneeId?: string | null }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updated = await prisma.task.update({
    where: { id: taskId },
    data
  })

  // Optional: create activity log
  let content = ''
  if (data.description !== undefined) content = 'updated the description'
  else if (data.dueDate !== undefined || data.startDate !== undefined) content = 'updated dates'
  else if (data.assigneeId !== undefined) content = data.assigneeId ? 'assigned a member' : 'removed the assignee'

  if (content) {
    await prisma.taskActivity.create({
      data: {
        taskId,
        userId: user.id,
        type: 'system',
        content
      }
    })
  }

  return updated
}

export async function addComment(taskId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const activity = await prisma.taskActivity.create({
    data: {
      taskId,
      userId: user.id,
      type: 'comment',
      content
    },
    include: { user: true }
  })

  return activity
}
