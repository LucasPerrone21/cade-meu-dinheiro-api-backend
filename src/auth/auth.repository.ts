import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { env } from 'src/config/env';
import ms from 'ms';
import { hash } from 'bcrypt';
import { StringValue } from 'ms';

@Injectable()
export class AuthRepository {
  constructor(private prismaService: PrismaService) {}

  async createRefreshToken(userId: string, refreshToken: string) {
    const jwtExpiresAt = new Date(
      Date.now() + ms(env.JWT_REFRESH_EXPIRES as StringValue),
    );

    const hashToken = await hash(refreshToken, 10);

    return await this.prismaService.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken,
        expiresAt: jwtExpiresAt,
      },
    });
  }

  async findRefreshToken(userId: string) {
    return await this.prismaService.refreshToken.findFirst({
      where: {
        userId,
      },
    });
  }

  async deleteRefreshToken(userId: string) {
    return await this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
