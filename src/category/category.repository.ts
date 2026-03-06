import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from 'generated/prisma/internal/class';

@Injectable()
export class CategoryRepository {
  constructor(private prismaService: PrismaService) {}

  async createCategory(userId: string, name: string) {
    return this.prismaService.category.create({
      data: {
        name,
        userId,
        type: 'USER',
      },
    });
  }

  async findAllByUserId(userId: string) {
    return this.prismaService.category.findMany({
      where: { OR: [{ userId }, { type: 'SYSTEM' }] },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prismaService.category.findUnique({ where: { id } });
  }

  async updateCategoryById(id: string, name: string) {
    return this.prismaService.category.update({
      where: { id },
      data: { name },
    });
  }

  async deleteCategoryById(id: string, tx?: PrismaClient) {
    const prisma = tx || this.prismaService;
    return prisma.category.delete({ where: { id } });
  }

  async findSystemCategoryByName(name: string) {
    return this.prismaService.category.findFirst({
      where: {
        name,
        type: 'SYSTEM',
      },
    });
  }
}
