const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const members = await prisma.teamMember.findMany();
  console.log(JSON.stringify(members.map(m => ({ id: m.id, nameAr: m.nameAr, nameEn: m.nameEn })), null, 2));
}

main().finally(() => prisma.$disconnect());
