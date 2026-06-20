import prisma from '../config/prisma';

export interface EnquiryFilter {
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export class EnquiryRepository {
  async create(data: any) {
    return prisma.enquiry.create({
      data,
    });
  }

  async findAll(filter: EnquiryFilter = {}) {
    const where: any = {};

    if (filter.search) {
      const searchLower = filter.search;
      where.OR = [
        { name: { contains: searchLower } },
        { companyName: { contains: searchLower } },
        { email: { contains: searchLower } },
        { phone: { contains: searchLower } },
        { country: { contains: searchLower } },
        { productInterested: { contains: searchLower } },
        { message: { contains: searchLower } },
      ];
    }

    if (filter.startDate || filter.endDate) {
      where.createdAt = {};
      if (filter.startDate) {
        where.createdAt.gte = filter.startDate;
      }
      if (filter.endDate) {
        where.createdAt.lte = filter.endDate;
      }
    }

    return prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: number) {
    return prisma.enquiry.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.enquiry.count();
  }

  async findRecent(limit = 5) {
    return prisma.enquiry.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const enquiryRepository = new EnquiryRepository();
