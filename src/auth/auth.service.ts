import { Injectable } from '@nestjs/common';
import SignInDTO from './dtos/signInDTO';
import SignUpDTO from './dtos/signUpDTO';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/config/env';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

    return { accessToken, refreshToken };
  }
}
