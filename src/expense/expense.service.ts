import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseRepository } from './expense.repository';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { UpdateExpenseDto } from './dtos/update-expense.dto';
import { FilterExpenseDto } from './dtos/filter-expense.dto';
import { createHash } from 'crypto';

@Injectable()
export class ExpenseService {
  constructor(private expenseRepository: ExpenseRepository) {}

  async create(userId: string, dto: CreateExpenseDto) {
    const unhash = `${dto.statementId}-${dto.date.toISOString()}-${dto.amount}-${dto.descriptionOriginal}`;
    const hashUnique = createHash('sha256').update(unhash).digest('hex');

    return this.expenseRepository.create(userId, hashUnique, dto);
  }

  async findAll(userId: string, filter: FilterExpenseDto) {
    return this.expenseRepository.findAll(userId, filter);
  }

  async findById(id: string, userId: string) {
    const expense = await this.expenseRepository.findById(id);
    if (!expense || expense.userId !== userId) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    await this.findById(id, userId);
    return this.expenseRepository.update(id, dto);
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    return this.expenseRepository.delete(id);
  }
}
