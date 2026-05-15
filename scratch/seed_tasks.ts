import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { id: { in: ['u1', 'u2', 'u3', 'u4'] } }
  });
  
  const projects = await prisma.project.findMany({
    include: { lists: true }
  });

  console.log('Seeding sample tasks for members...');

  for (const project of projects) {
    if (project.lists.length === 0) continue;
    
    const todoList = project.lists.find(l => l.name.toLowerCase().includes('todo')) || project.lists[0];
    const inProgressList = project.lists.find(l => l.name.toLowerCase().includes('progress')) || project.lists[0];
    const doneList = project.lists.find(l => l.name.toLowerCase().includes('done')) || project.lists[0];

    for (const user of users) {
      // 1 Task Todo
      await prisma.task.create({
        data: {
          title: `Fix UI bugs for ${user.name}`,
          userId: project.userId, // Creator is the main user
          assigneeId: user.id,
          listId: todoList.id,
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM
        }
      });

      // 1 Task In Progress
      await prisma.task.create({
        data: {
          title: `Implement API for ${user.name}`,
          userId: project.userId,
          assigneeId: user.id,
          listId: inProgressList.id,
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH
        }
      });

      // 1 Task Done
      await prisma.task.create({
        data: {
          title: `Setup environment for ${user.name}`,
          userId: project.userId,
          assigneeId: user.id,
          listId: doneList.id,
          status: TaskStatus.DONE,
          priority: TaskPriority.LOW
        }
      });
    }
  }

  console.log('Successfully seeded tasks for all members.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
