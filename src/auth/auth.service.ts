import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type SignInDTO from './dtos/signInDTO';
import type SignUpDTO from './dtos/signUpDTO';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  async signUp(data: SignUpDTO) {
    return this.usersService.create(data);
  }

  async signIn(data: SignInDTO) {}
}
