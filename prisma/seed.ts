import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const userPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('adminpassword123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Owner',
      email: 'admin@prodly.com',
      passwordHash: adminPassword,
      role: 'admin'
    }
  });

  const user = await prisma.user.create({
    data: {
      name: 'Jamie Cataloger',
      email: 'jamie@prodly.com',
      passwordHash: userPassword,
      role: 'user'
    }
  });

  const products = [
    {
      name: 'Aurora Smart Lamp',
      description: 'Wi-Fi enabled smart lamp with warm and cool lighting presets.',
      price: 129,
      sku: 'AUR-LAMP-001',
      quantity: 24,
      images: JSON.stringify(['/images/feature.jpg'])
    },
    {
      name: 'Nimbus Desk Chair',
      description: 'Ergonomic chair with breathable mesh and adjustable lumbar support.',
      price: 249,
      sku: 'NIM-CHAIR-201',
      quantity: 8,
      images: JSON.stringify(['/images/hero.jpg'])
    },
    {
      name: 'Pulse Fitness Band',
      description: 'Slim fitness tracker with heart-rate monitoring and sleep insights.',
      price: 79,
      sku: 'PULSE-BAND-118',
      quantity: 40,
      images: JSON.stringify(['/images/cta.jpg'])
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        createdBy: user.id
      }
    });
  }

  await prisma.product.create({
    data: {
      name: 'Atlas Standing Desk',
      description: 'Electric standing desk with memory presets and cable management.',
      price: 499,
      sku: 'ATL-DESK-402',
      quantity: 5,
      images: JSON.stringify(['/images/feature.jpg']),
      createdBy: admin.id
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
