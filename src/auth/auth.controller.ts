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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import SignInDTO from './dtos/signInDTO';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed',
  })
  @ApiBody({ type: SignUpDTO })
  @Post('signup')
  async signup(@Body() body: SignUpDTO) {
    return this.authService.signUp(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiBody({ type: SignInDTO })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiOperation({ summary: 'Authenticate user and return tokens' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signin(@Req() req: AuthRequest, @Body() body: SignInDTO) {
    return this.authService.generateTokens(req.user.id, req.user.email);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired refresh token',
  })
  async refresh(@Req() req: RefreshRequest) {
    return this.authService.refreshTokens(
      req.user.id,
      req.user.email,
      req.user.refreshToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile information' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing access token',
  })
  getProfile(@Req() req: AuthRequest) {
    return { id: req.user.id, email: req.user.email };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing access token',
  })
  async logout(@Req() req: AuthRequest) {
    await this.authService.logout(req.user.id, req.user.accessToken);
    return { message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description:
      'If an account with that email exists, a password reset link has been sent.',
  })
  @ApiBody({ type: ForgotPasswordDTO })
  async forgotPassword(@Body() body: ForgotPasswordDTO) {
    await this.authService.requestPasswordReset(body.email);
    return {
      message:
        'If an account with that email exists, a password reset link has been sent.',
    };
  }

  @Post('reset-password')
  @ApiResponse({
    status: 200,
    description: 'Password has been reset successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid token or password',
  })
  @ApiBody({ type: ResetPasswordDTO })
  @ApiOperation({ summary: 'Reset user password' })
  async resetPassword(@Body() body: ResetPasswordDTO) {
    await this.authService.resetPassword(body.token, body.password);
    return { message: 'Password has been reset successfully' };
  }
}
