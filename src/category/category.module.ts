import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { ExpenseRepository } from 'src/expense/expense.repository';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, ExpenseRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
