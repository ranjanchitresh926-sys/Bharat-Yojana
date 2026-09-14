import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const schemes = await prisma.scheme.findMany();
  const fallbacks = schemes.filter(s => s.sourceCitation === 'Official Scheme Guidelines');
  console.log(Real URLs: );
  console.log(Fallbacks: );
  console.log(Fallback codes: );
}
main().finally(() => prisma.$disconnect());
