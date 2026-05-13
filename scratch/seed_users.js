const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dummyUsers = [
    {
      id: 'dummy-user-1',
      email: 'tony.stark@starkindustries.com',
      name: 'Tony Stark',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tony',
    },
    {
      id: 'dummy-user-2',
      email: 'steve.rogers@avengers.com',
      name: 'Steve Rogers',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steve',
    },
    {
      id: 'dummy-user-3',
      email: 'natasha.romanoff@shield.gov',
      name: 'Natasha Romanoff',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natasha',
    },
    {
      id: 'dummy-user-4',
      email: 'bruce.banner@gamma.lab',
      name: 'Bruce Banner',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bruce',
    },
    {
      id: 'dummy-user-5',
      email: 'peter.parker@dailybugle.com',
      name: 'Peter Parker',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peter',
    },
  ];

  console.log('Seeding dummy users...');

  for (const user of dummyUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
    console.log(`Upserted user: ${user.name}`);
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
