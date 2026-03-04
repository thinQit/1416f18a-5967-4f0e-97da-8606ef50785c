import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123', 10);

  const admin = await prisma.user.findUnique({ where: { email: 'admin@merchmate.com' } });
  const user = await prisma.user.findUnique({ where: { email: 'user@merchmate.com' } });

  const adminUser = admin ??
    (await prisma.user.create({
      data: {
        name: 'MerchMate Admin',
        email: 'admin@merchmate.com',
        passwordHash,
        role: 'admin'
      }
    }));

  const regularUser = user ??
    (await prisma.user.create({
      data: {
        name: 'Store Manager',
        email: 'user@merchmate.com',
        passwordHash,
        role: 'user'
      }
    }));

  const products = [
    {
      name: 'Streetwear Hoodie',
      description: 'Heavyweight fleece hoodie with embroidered logo and ribbed cuffs.',
      price: 79.99,
      sku: 'MM-HOOD-001',
      stock: 42,
      imageUrl: '/images/feature.jpg',
      createdBy: adminUser.id
    },
    {
      name: 'Canvas Tote',
      description: 'Eco-friendly canvas tote bag with reinforced straps.',
      price: 24.5,
      sku: 'MM-TOTE-002',
      stock: 120,
      imageUrl: '/images/cta.jpg',
      createdBy: adminUser.id
    },
    {
      name: 'Enamel Mug',
      description: 'Vintage enamel mug perfect for desk or campfire.',
      price: 18,
      sku: 'MM-MUG-003',
      stock: 75,
      imageUrl: '/images/hero.jpg',
      createdBy: regularUser.id
    },
    {
      name: 'Logo Cap',
      description: 'Adjustable cap with embroidered MerchMate branding.',
      price: 29.99,
      sku: 'MM-CAP-004',
      stock: 55,
      imageUrl: '/images/feature.jpg',
      createdBy: regularUser.id
    }
  ];

  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { sku: product.sku } });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
