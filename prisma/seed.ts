import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'john@example.com',
        name: 'John Doe',
        age: 30,
        role: 'USER',
        isActive: true,
      },
      {
        email: 'jane@example.com',
        name: 'Jane Smith',
        age: 25,
        role: 'ADMIN',
        isActive: true,
      },
      {
        email: 'bob@example.com',
        name: 'Bob Johnson',
        age: 30,
        role: 'USER',
        isActive: false,
      },
      {
      email: 'sarah@example.com',
      name: 'Sarah Wilson',
      age: 28,
      role: 'USER',
      isActive: true,
    },
    {
      email: 'mike@example.com',
      name: 'Mike Davis',
      age: 35,
      role: 'MODERATOR',
      isActive: true,
    },
    {
      email: 'emma@example.com',
      name: 'Emma Brown',
      age: 22,
      role: 'USER',
      isActive: false,
    },
    {
      email: 'alex@example.com',
      name: 'Alex Taylor',
      age: 30,
      role: 'USER',
      isActive: true,
    },
    {
      email: 'lisa@example.com',
      name: 'Lisa Martinez',
      age: 27,
      role: 'ADMIN',
      isActive: true,
    },
    ],
  });

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });