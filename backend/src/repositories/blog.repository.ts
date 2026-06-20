import prisma from '../config/prisma';

export class BlogRepository {
  async findAll(publishedOnly = false) {
    return prisma.blog.findMany({
      where: publishedOnly ? { isPublished: true } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return prisma.blog.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return prisma.blog.findUnique({
      where: { slug },
    });
  }

  async create(data: any) {
    return prisma.blog.create({
      data,
    });
  }

  async update(id: number, data: any) {
    return prisma.blog.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.blog.delete({
      where: { id },
    });
  }

  async count(publishedOnly = false) {
    return prisma.blog.count({
      where: publishedOnly ? { isPublished: true } : {},
    });
  }

  async findRecent(limit = 5) {
    return prisma.blog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const blogRepository = new BlogRepository();
