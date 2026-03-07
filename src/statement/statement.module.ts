import { Module } from '@nestjs/common';
import { StatementService } from './statement.service';
import { StatementController } from './statement.controller';
import { CreditCardModule } from 'src/credit-card/credit-card.module';
import { StorageModule } from 'src/storage/storage.module';
import { StatementRepository } from './statement.repositoty';
import { ExpenseModule } from 'src/expense/expense.module';
import { CategoryModule } from 'src/category/category.module';
import { AiModule } from 'src/ai/ai.module';
import { ProcessingLogModule } from 'src/processing-log/processing-log.module';

@Module({
  imports: [
    CreditCardModule,
    StorageModule,
    AiModule,
    CategoryModule,
    ExpenseModule,
    ProcessingLogModule,
  ],
  providers: [StatementService, StatementRepository],
  controllers: [StatementController],
})
export class StatementModule {}
