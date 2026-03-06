import { Module } from '@nestjs/common';
import { StatementService } from './statement.service';
import { StatementController } from './statement.controller';

@Module({
  providers: [StatementService],
  controllers: [StatementController]
})
export class StatementModule {}
