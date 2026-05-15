import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userIds = (await prisma.user.findMany({ select: { id: true } })).map(u => u.id);
  
  // Delete tasks without a valid creator
  const deletedTasks = await prisma.task.deleteMany({
    where: {
      userId: {
        notIn: userIds
      }
    }
  });
  console.log(`Deleted ${deletedTasks.count} orphaned tasks.`);

  // Delete projects without a valid creator
  const deletedProjects = await prisma.project.deleteMany({
    where: {
      userId: {
        notIn: userIds
      }
    }
  });
  console.log(`Deleted ${deletedProjects.count} orphaned projects.`);

  // Delete board lists without a valid creator
  const deletedLists = await prisma.boardList.deleteMany({
    where: {
      userId: {
        notIn: userIds
      }
    }
  });
  console.log(`Deleted ${deletedLists.count} orphaned board lists.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
