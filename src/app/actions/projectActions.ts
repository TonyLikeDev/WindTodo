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

export async function getProjects() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  return prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  })
}

export async function createProject(name: string, color: string) {
  const userId = await requireUserId()
  const project = await prisma.project.create({
    data: { name, color, userId },
  })
  revalidatePath('/dashboard')
  return project
}

export async function deleteProject(projectId: string) {
  const userId = await requireUserId()
  const lists = await prisma.boardList.findMany({
    where: { projectId, userId },
    select: { id: true },
  })
  const listIds = lists.map((l) => l.id)
  if (listIds.length > 0) {
    await prisma.task.deleteMany({
      where: { userId, listId: { in: listIds } },
    })
  }
  await prisma.project.deleteMany({ where: { id: projectId, userId } })
  revalidatePath('/dashboard')
}

export async function getBoardLists(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  return prisma.boardList.findMany({
    where: { projectId, userId: user.id },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  })
}

export async function createBoardList(projectId: string, name: string, color: string) {
  const userId = await requireUserId()

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  })
  if (!project) throw new Error('Project not found')

  const last = await prisma.boardList.findFirst({
    where: { projectId, userId },
    orderBy: { position: 'desc' },
    select: { position: true },
  })

  const list = await prisma.boardList.create({
    data: {
      name,
      color,
      userId,
      projectId,
      position: (last?.position ?? -1) + 1,
    },
  })
  revalidatePath(`/projects/${projectId}`)
  return list
}

export async function deleteBoardList(listId: string) {
  const userId = await requireUserId()
  const list = await prisma.boardList.findFirst({
    where: { id: listId, userId },
    select: { projectId: true },
  })
  if (!list) return
  await prisma.task.deleteMany({ where: { userId, listId } })
  await prisma.boardList.deleteMany({ where: { id: listId, userId } })
  revalidatePath(`/dashboard/projects/${list.projectId}`)
}
