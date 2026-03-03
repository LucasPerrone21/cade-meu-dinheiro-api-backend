import { Injectable, UnauthorizedException } from '@nestjs/common';
import SignInDTO from './dtos/signInDTO';
import SignUpDTO from './dtos/signUpDTO';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/config/env';
import type { StringValue } from 'ms';
import { AuthRepository } from './auth.repository';
import { compare } from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private emailService: EmailService,
  ) {}

  async signUp(data: SignUpDTO) {
    const user = await this.usersService.create(data);

    return this.generateTokens(user.id, user.email);
  }

  async signIn(data: SignInDTO) {
    const user = await this.usersService.validateUser(
      data.email,
      data.password,
    );
    if (!user) {
      return null;
    }

    const { hashPassword: _password, ...result } = user;
    return result;
  }

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: env.JWT_ACCESS_EXPIRES as StringValue,
      }),
      this.jwtService.signAsync(payload, {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_REFRESH_EXPIRES as StringValue,
      }),
    ]);

    await this.authRepository.createRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, email: string, refreshToken: string) {
    const storedToken = await this.authRepository.findRefreshToken(userId);

    if (!storedToken || !storedToken.tokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValidToken = await compare(refreshToken, storedToken.tokenHash);

    if (!isValidToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.authRepository.deleteRefreshToken(userId);

    return this.generateTokens(userId, email);
  }

  async logout(userId: string) {
    await this.authRepository.deleteRefreshToken(userId);
    return;
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return;
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    await this.authRepository.createPasswordResetToken(user.id, tokenHash);
    await this.emailService.sendPasswordResetEmail(email, token);
    return;
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const storedToken =
      await this.authRepository.findPasswordResetToken(tokenHash);

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException(
        'Invalid or expired password reset token',
      );
    }

    const user = await this.usersService.findById(storedToken.userId);
    if (!user) {
      throw new UnauthorizedException(
        'Invalid or expired password reset token',
      );
    }

    await this.usersService.updatePassword(user.id, newPassword);
    await this.authRepository.deletePasswordResetToken(tokenHash);

    return { message: 'Password reset successful' };
  }
}
