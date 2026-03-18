import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { CreditCardModule } from './credit-card/credit-card.module';
import { CategoryModule } from './category/category.module';
import { ExpenseModule } from './expense/expense.module';
import { StatementModule } from './statement/statement.module';
import { StorageModule } from './storage/storage.module';
import { AiModule } from './ai/ai.module';
import { ProcessingLogModule } from './processing-log/processing-log.module';
import { InsightsModule } from './insights/insights.module';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    EmailModule,
    RedisModule,
    CreditCardModule,
    CategoryModule,
    ExpenseModule,
    StatementModule,
    StorageModule,
    AiModule,
    ProcessingLogModule,
    InsightsModule,
    HelperModule,
  ],
})
export class AppModule {}
