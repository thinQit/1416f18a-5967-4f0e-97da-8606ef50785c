import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const adminPassword = await bcrypt.hash('AdminPass123!', 10);
  const userPassword = await bcrypt.hash('UserPass123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@proddash.dev' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@proddash.dev',
      password_hash: adminPassword,
      role: 'admin'
    }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@proddash.dev' },
    update: {},
    create: {
      name: 'Sample User',
      email: 'user@proddash.dev',
      password_hash: userPassword,
      role: 'user'
    }
  });

  const existingProducts = await prisma.product.count();
  if (existingProducts > 0) return;

  const products = [
    {
      title: 'Aurora Smart Lamp',
      description: 'Voice-enabled desk lamp with adaptive brightness and color temperature controls.',
      price: 89.99,
      inventory: 24,
      image_url: '/images/feature.jpg',
      owner_id: admin.id
    },
    {
      title: 'Nimbus Travel Backpack',
      description: 'Weather-resistant backpack with modular compartments and USB charging port.',
      price: 129.0,
      inventory: 12,
      image_url: '/images/hero.jpg',
      owner_id: user.id
    },
    {
      title: 'Pulse Fitness Band',
      description: 'Lightweight fitness tracker with heart-rate monitoring and sleep analytics.',
      price: 59.5,
      inventory: 38,
      image_url: '/images/cta.jpg',
      owner_id: user.id
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
}

main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Seed failed';
    console.error(message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
