import { PrismaClient } from '@prisma/client';

async function seedDev() {
  const prisma = new PrismaClient();
  const wallet = await prisma.wallet.upsert({
    where: {
      publicKey: 'D1ALECTfeCZt9bAbPWtJk7ntv24vDYGPmyS7swp7DY5h',
    },
    create: {
      id: '44a34c33-9938-49f3-935c-dcbf35d1b5a1',
      publicKey: 'D1ALECTfeCZt9bAbPWtJk7ntv24vDYGPmyS7swp7DY5h',
    },
    update: {},
  });
  const address = await prisma.address.upsert({
    where: {
      id: '44a34c33-9938-49f3-935c-dcbf35d1b5a2',
    },
    create: {
      id: '44a34c33-9938-49f3-935c-dcbf35d1b5a2',
      type: 'email',
      value: 'hello@dialect.to',
      verified: true,
      walletId: wallet.id, // TODO: Set wallet instead
    },
    update: {},
  });
  const dapp = await prisma.dapp.upsert({
    where: {
      id: '44a34c33-9938-49f3-935c-dcbf35d1b5a3',
    },
    create: {
      id: '44a34c33-9938-49f3-935c-dcbf35d1b5a3',
      name: 'dialect',
    },
    update: {},
  });
  const dappAddress = await prisma.dappAddress.upsert({
    where: {
      id: '44a34c33-9938-49f3-935c-dcbf35d1b5a4',
    },
    create: {
      id: '44a34c33-9938-49f3-935c-dcbf35d1b5a4',
      dappId: dapp.id,
      addressId: address.id,
      enabled: true,
    },
    update: {},
  });
  
  return;
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
