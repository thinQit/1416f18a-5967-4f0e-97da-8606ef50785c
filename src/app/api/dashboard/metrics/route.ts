import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_request: NextRequest) {
  try {
    const [totalUsers, totalProducts, recentProducts, recentUsers] = await Promise.all([
      db.user.count(),
      db.product.count({ where: { deleted: false } }),
      db.product.findMany({ where: { deleted: false }, orderBy: { createdAt: 'desc' }, take: 5 }),
      db.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        recentProducts: recentProducts.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          sku: product.sku,
          stock: product.stock,
          images: product.images ? JSON.parse(product.images) : [],
          createdBy: product.createdBy,
          createdAt: product.createdAt
        })),
        recentUsers: recentUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }))
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
