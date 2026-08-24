import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordOfficer1 = "officer1_pass";
  const passwordOfficer2 = "officer2_pass";
  const passwordAdmin = "admin_pass";

  const hashOfficer1 = await bcrypt.hash(passwordOfficer1, 10);
  const hashOfficer2 = await bcrypt.hash(passwordOfficer2, 10);
  const hashAdmin = await bcrypt.hash(passwordAdmin, 10);

  const users = [
    { email: "officer1@example.com", passwordHash: hashOfficer1, role: "officer" },
    { email: "officer2@example.com", passwordHash: hashOfficer2, role: "officer" },
    { email: "admin@example.com", passwordHash: hashAdmin, role: "admin" },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  console.log("Seeding finished.");
  console.log("Accounts created:");
  console.log("------------------");
  console.log(`Officer 1: officer1@example.com / ${passwordOfficer1}`);
  console.log(`Officer 2: officer2@example.com / ${passwordOfficer2}`);
  console.log(`Admin:     admin@example.com / ${passwordAdmin}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
