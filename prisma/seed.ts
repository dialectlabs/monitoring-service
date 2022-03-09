import { PrismaClient } from '@prisma/client';

async function seedDev() {
  const prisma = new PrismaClient();
  return prisma.userExample.upsert({
    where: {
      id: '44a34c33-9938-49f3-935c-dcbf35d1b5a1',
    },
    create: {
      id: '44a34c33-9938-49f3-935c-dcbf35d1b5a1',
      name: 'Example user name',
      phoneNumber: '+111111111',
    },
    update: {},
  });
}

async function main() {
  const env = process.env.ENVIRONMENT;
  if (env === 'dev' || env === 'dev-local') {
    await seedDev();
  } else {
    console.log(`${env} cannot be seeded`);
  }
}

main();
