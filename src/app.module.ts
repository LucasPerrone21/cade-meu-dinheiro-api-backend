import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, EmailModule],
})
export class AppModule {}
