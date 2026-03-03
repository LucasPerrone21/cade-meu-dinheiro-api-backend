import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import SignUpDTO from './dtos/signUpDTO';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { Req } from '@nestjs/common';
import AuthRequest from './interfaces/authRequest';

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
}
