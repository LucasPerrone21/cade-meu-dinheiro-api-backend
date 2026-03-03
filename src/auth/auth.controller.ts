import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import SignUpDTO from './dtos/signUpDTO';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Req } from '@nestjs/common';
import AuthRequest from './interfaces/authRequest';
import RefreshRequest from './interfaces/refreshRequest';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import ForgotPasswordDTO from './dtos/forgotPasswordDTO';
import ResetPasswordDTO from './dtos/resetPasswordDTO';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignUpDTO) {
    return this.authService.signUp(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req: AuthRequest) {
    return this.authService.generateTokens(req.user.id, req.user.email);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: RefreshRequest) {
    return this.authService.refreshTokens(
      req.user.id,
      req.user.email,
      req.user.refreshToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthRequest) {
    return { id: req.user.id, email: req.user.email };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: AuthRequest) {
    await this.authService.logout(req.user.id);
    return { message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDTO) {
    await this.authService.requestPasswordReset(body.email);
    return {
      message:
        'If an account with that email exists, a password reset link has been sent.',
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDTO) {
    await this.authService.resetPassword(body.token, body.password);
    return { message: 'Password has been reset successfully' };
  }
}
