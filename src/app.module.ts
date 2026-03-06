import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { CreditCardModule } from './credit-card/credit-card.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, EmailModule, RedisModule, CreditCardModule],
})
export class AppModule {}
