import { Module } from '@nestjs/common';
import { StatementService } from './statement.service';
import { StatementController } from './statement.controller';
import { CreditCardModule } from 'src/credit-card/credit-card.module';
import { StorageModule } from 'src/storage/storage.module';
import { StatementRepository } from './statement.repositoty';

@Module({
  imports: [CreditCardModule, StorageModule],
  providers: [StatementService, StatementRepository],
  controllers: [StatementController],
})
export class StatementModule {}
