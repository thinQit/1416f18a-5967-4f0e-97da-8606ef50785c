const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'admin@proddash.dev' } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@proddash.dev',
        password_hash: '$2a$10$9mMgt7o0sA7lQe6GkP3YbOe5xQyQ3pP2xMo2V5F.0O5DqVx9m3Nq6',
        role: 'admin'
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
