import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/internal/class';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { FilterExpenseDto } from './dtos/filter-expense.dto';
import { UpdateExpenseDto } from './dtos/update-expense.dto';

@Injectable()
export class ExpenseRepository {
  constructor(private prismaService: PrismaService) {}

  async create(userId: string, hashUnique: string, dto: CreateExpenseDto) {
    return this.prismaService.expense.create({
      data: {
        userId,
        amount: dto.amount,
        date: dto.date,
        statementId: dto.statementId,
        categoryAutoId: dto.categoryId,
        descriptionOriginal: dto.descriptionOriginal,
        descriptionNormalized: dto.descriptionOriginal,
        hashUnique: hashUnique,
        installmentCurrent: dto.installmentCurrent ?? null,
        installmentTotal: dto.installmentTotal ?? null,
      },
    });
  }

  async findAll(userId: string, filter: FilterExpenseDto) {
    const { statementId, categoryId, creditCardId, startDate, finalDate } =
      filter;

    return this.prismaService.expense.findMany({
      where: {
        userId,
        ...(statementId && { statementId }),
        ...(categoryId && { categoryAutoId: categoryId }),
        ...(startDate && { date: { gte: startDate } }),
        ...(finalDate && { date: { lte: finalDate } }),
        ...(creditCardId && { statement: { creditCardId } }),
      },
    });
  }

  async findById(id: string) {
    return this.prismaService.expense.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateExpenseDto) {
    return this.prismaService.expense.update({
      where: { id },
      data: {
        ...(dto.amount && { amount: dto.amount }),
        ...(dto.date && { date: dto.date }),
        ...(dto.categoryId && { categoryManualId: dto.categoryId }),
        ...(dto.descriptionOriginal && {
          descriptionOriginal: dto.descriptionOriginal,
        }),
        ...(dto.installmentCurrent && {
          installmentCurrent: dto.installmentCurrent,
        }),
        ...(dto.installmentTotal && { installmentTotal: dto.installmentTotal }),
      },
    });
  }

  async delete(id: string) {
    return this.prismaService.expense.delete({
      where: { id },
    });
  }

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
