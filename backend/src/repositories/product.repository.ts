import { prisma } from '../config/prisma';

export class ProductRepository {
  async findAll(status?: string) {
    return prisma.product.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return prisma.product.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    sku: string;
    category: string;
    moq: string;
    status: string;
    description: string;
    images: string;
    specs: string;
  }) {
    return prisma.product.create({ data });
  }

  async update(
    id: number,
    data: {
      name?: string;
      sku?: string;
      category?: string;
      moq?: string;
      status?: string;
      description?: string;
      images?: string;
      specs?: string;
    }
  ) {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.product.delete({ where: { id } });
  }

  async getDistinctCategories(): Promise<string[]> {
    const products = await prisma.product.findMany({
      where: { status: 'Published' },
      select: { category: true },
      distinct: ['category'],
    });
    return products.map((p) => p.category);
  }
}

export const productRepository = new ProductRepository();
