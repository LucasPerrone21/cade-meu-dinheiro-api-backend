import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  controllers: [AuthController, UsersController],
  providers: [PrismaService, UsersService, AuthService],
})
export class AppModule {}
