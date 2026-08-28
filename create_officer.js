const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
async function run() {
  const hash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'officer@example.com' },
    update: { passwordHash: hash, role: 'officer' },
    create: { email: 'officer@example.com', passwordHash: hash, role: 'officer' }
  });
  console.log('Officer created');
}
run().finally(() => prisma.$disconnect());
