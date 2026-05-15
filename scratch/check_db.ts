import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const tasks = await prisma.task.count();
  console.log(`Users: ${users}`);
  console.log(`Tasks: ${tasks}`);
  
  if (tasks > 0) {
    const orphanedTasks = await prisma.task.findMany({
      where: {
        userId: {
          notIn: (await prisma.user.findMany({ select: { id: true } })).map(u => u.id)
        }
      }
    });
    console.log(`Orphaned tasks: ${orphanedTasks.length}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
