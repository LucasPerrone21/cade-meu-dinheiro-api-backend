import { Body, Controller, Post } from '@nestjs/common';
import SignInDTO from './dtos/signInDTO';
import SignUpDTO from './dtos/signUpDTO';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignUpDTO) {
    return this.authService.signUp(body);
  }

  @Post('signin')
  async signin(@Body() body: SignInDTO) {
    return this.authService.signIn(body);
  }
}
