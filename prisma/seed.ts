import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Alex Admin',
      email: 'admin@shopflow.io',
      passwordHash: adminPassword,
      role: 'admin'
    }
  });

  await prisma.user.create({
    data: {
      name: 'Jamie Shopper',
      email: 'user@shopflow.io',
      passwordHash: userPassword,
      role: 'user'
    }
  });

  const products = [
    {
      name: 'Aurora Desk Lamp',
      description: 'Minimalist desk lamp with adjustable brightness and warm ambient glow.',
      price: 89.99,
      stock: 32,
      imageUrl: '/images/feature.jpg'
    },
    {
      name: 'Nimbus Travel Backpack',
      description: 'Lightweight travel backpack with laptop sleeve and waterproof shell.',
      price: 129.0,
      stock: 18,
      imageUrl: '/images/hero.jpg'
    },
    {
      name: 'Crestline Coffee Set',
      description: 'Handcrafted ceramic coffee set with four mugs and a pour-over dripper.',
      price: 64.5,
      stock: 45,
      imageUrl: '/images/cta.jpg'
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        createdBy: admin.id
      }
    });
  }

  await prisma.upload.create({
    data: {
      url: '/uploads/sample-image.jpg'
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
