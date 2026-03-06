import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { ExpenseRepository } from './expense.repository';

@Module({
  providers: [ExpenseService, ExpenseRepository],
  controllers: [ExpenseController],
  exports: [ExpenseModule],
})
export class ExpenseModule {}
