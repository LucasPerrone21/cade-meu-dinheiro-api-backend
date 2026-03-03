import { PrismaService } from 'src/prisma/prisma.service';
import type SignUpDTO from '../auth/dtos/signUpDTO';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: SignUpDTO) {
    const { email, name, birthDate, password } = data;

    return this.prismaService.user.create({
      data: {
        email,
        name,
        birthDate,
        hashPassword: password,
      },
    });
  }

  async updatePassword(userId: string, hashPassword: string) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashPassword,
      },
    });
  }
}
