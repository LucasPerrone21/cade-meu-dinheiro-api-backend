import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { ExpenseRepository } from 'src/expense/expense.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from 'generated/prisma/internal/class';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { Category } from 'generated/prisma/client';
import UpdateCategoryDTO from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private expenseRepository: ExpenseRepository,
    private prismaService: PrismaService,
  ) {}

  async createCategory(userId: string, dto: CreateCategoryDTO) {
    return this.categoryRepository.createCategory(userId, dto.name);
  }

  async findAllByUserId(userId: string) {
    return this.categoryRepository.findAllByUserId(userId);
  }

  async findAllSystemCategories() {
    return this.categoryRepository.findAllSystemCategories();
  }

  async findById(id: string, userId: string) {
    const category = await this.categoryRepository.findById(id);
    if (
      !category ||
      (category.userId !== userId && category?.type !== 'SYSTEM')
    ) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategoryById(id: string, dto: UpdateCategoryDTO, userId: string) {
    const category = await this.findById(id, userId);
    this.ensureNotSystem(category);
    return this.categoryRepository.updateCategoryById(id, dto.name);
  }

  async deleteCategoryById(id: string, userId: string) {
    const category = await this.findById(id, userId);
    this.ensureNotSystem(category);
    const otherCategory =
      await this.categoryRepository.findSystemCategoryByName('Outros');

    if (!otherCategory) {
      throw new Error('System category "Outros" not found');
    }

    await this.prismaService.$transaction(async (tx: PrismaClient) => {
      await this.expenseRepository.migrateCategoryExpenses(
        id,
        otherCategory.id,
        tx,
      );
      await this.categoryRepository.deleteCategoryById(id, tx);
    });
  }

  private ensureNotSystem(category: Category) {
    if (category.type === 'SYSTEM') {
      throw new ForbiddenException('Cannot modify system categories');
    }
  }
}
