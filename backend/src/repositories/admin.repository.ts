import prisma from '../config/prisma';

export class AdminRepository {
  async findByEmail(email: string) {
    return prisma.admin.findUnique({
      where: { email },
    });
  }

  async findFirst() {
    return prisma.admin.findFirst();
  }

  async create(data: any) {
    return prisma.admin.create({
      data,
    });
  }
}

export const adminRepository = new AdminRepository();
