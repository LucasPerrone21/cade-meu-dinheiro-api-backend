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

  async createPasswordResetToken(userId: string, tokenHash: string) {
    const expiresAt = new Date(
      Date.now() + ms(env.PASSWORD_RESET_TOKEN_EXPIRES as StringValue),
    );
    return await this.prismaService.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async findPasswordResetToken(tokenHash: string) {
    return await this.prismaService.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });
  }

  async deletePasswordResetToken(tokenHash: string) {
    return await this.prismaService.passwordResetToken.delete({
      where: {
        tokenHash,
      },
    });
  }
}
