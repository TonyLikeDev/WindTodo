import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const mockUsers = [
    { id: 'u1', name: 'Tony Stark', email: 'tony@stark.com' },
    { id: 'u2', name: 'Steve Rogers', email: 'steve@rogers.com' },
    { id: 'u3', name: 'Natasha Romanoff', email: 'natasha@romanoff.com' },
    { id: 'u4', name: 'Bruce Banner', email: 'bruce@banner.com' },
  ];

  console.log('Seeding mock users...');
  const users = await Promise.all(
    mockUsers.map(u => 
      prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name },
        create: { id: u.id, name: u.name, email: u.email }
      })
    )
  );
  console.log(`Created ${users.length} users.`);

  const projects = await prisma.project.findMany();
  console.log(`Found ${projects.length} projects.`);

  for (const project of projects) {
    console.log(`Adding members to project: ${project.name}`);
    await prisma.project.update({
      where: { id: project.id },
      data: {
        members: {
          connect: users.map(u => ({ id: u.id }))
        }
      }
    });
  }
  
  console.log('Successfully added users to all projects.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
