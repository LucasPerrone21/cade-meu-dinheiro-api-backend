import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/internal/class';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpenseRepository {
  constructor(private prismaService: PrismaService) {}

  async migrateCategoryExpenses(
    oldCategoryId: string,
    newCategoryId: string,
    tx?: PrismaClient,
  ) {
    const prisma = tx || this.prismaService;
    return Promise.all([
      prisma.expense.updateMany({
        where: { categoryAutoId: oldCategoryId },
        data: { categoryAutoId: newCategoryId },
      }),
      prisma.expense.updateMany({
        where: { categoryManualId: oldCategoryId },
        data: { categoryManualId: null },
      }),
    ]);
  }
}
