import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsightsFilterDto } from './dtos/insights-filter.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class InsightsService {
  constructor(private prismaService: PrismaService) {}

  async getTotalByCategory(userId: string, filter: InsightsFilterDto) {
    const { startDate, endDate, creditCardId } = filter;

    const result = await this.prismaService.expense.groupBy({
      by: ['categoryAutoId'],
      _sum: { amount: true },
      where: {
        userId,
        ...((startDate || endDate) && {
          date: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        }),
        ...(creditCardId && { statement: { creditCardId } }),
      },
    });

    const categoriesId = result.map((item) => item.categoryAutoId);
    const categories = await this.prismaService.category.findMany({
      where: { id: { in: categoriesId } },
    });

    return result.map((item) => {
      const category = categories.find((cat) => cat.id === item.categoryAutoId);
      return {
        category: category ? category.name : 'Unknown',
        total: item._sum.amount,
      };
    });
  }

  async getTopFiveExpenses(userId: string, filter: InsightsFilterDto) {
    const { startDate, endDate, creditCardId } = filter;

    const expenses = await this.prismaService.expense.findMany({
      where: {
        userId,
        ...((startDate || endDate) && {
          date: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        }),
        ...(creditCardId && { statement: { creditCardId } }),
      },
      orderBy: { amount: 'desc' },
      take: 5,
      include: {
        categoryAuto: true,
      },
    });

    return expenses;
  }

  async getExpensesByCreditCard(userId: string, filter: InsightsFilterDto) {
    const { startDate, endDate, creditCardId } = filter;

    if (!creditCardId) {
      throw new BadRequestException(
        'creditCardId is required for this insight',
      );
    }

    const expenses = await this.prismaService.expense.findMany({
      where: {
        userId,
        ...((startDate || endDate) && {
          date: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        }),
        statement: { creditCardId },
      },
      orderBy: { date: 'desc' },
      include: {
        categoryAuto: true,
      },
    });

    return expenses;
  }

  async getStatementResume(userId: string, statementId: string) {
    const statement = await this.prismaService.statement.findFirst({
      where: { id: statementId, userId },
      include: {
        _count: { select: { expenses: true } },
        expenses: true,
      },
    });

    if (!statement) throw new NotFoundException('Statement not found');

    return {
      totalAmount: statement.totalAmount,
      dueDate: statement.dueDate,
      expenseCount: statement._count.expenses,
      expenses: statement.expenses,
    };
  }

  async getMonthlySpending(userId: string, filter: InsightsFilterDto) {
    const { startDate, endDate } = filter;

    const result = await this.prismaService.$queryRaw<
      { month: Date; total: string }[]
    >`
  SELECT 
    DATE_TRUNC('month', "date") AS month,
    SUM(amount) AS total
  FROM "Expense"
  WHERE "userId" = ${userId}
  ${startDate ? Prisma.sql`AND "date" >= ${startDate}` : Prisma.empty}
  ${endDate ? Prisma.sql`AND "date" <= ${endDate}` : Prisma.empty}
  GROUP BY month
  ORDER BY month
`;

    return result.map((item) => ({
      month: item.month.toISOString().slice(0, 7), // Format as YYYY-MM
      total: parseFloat(item.total),
    }));
  }
}
