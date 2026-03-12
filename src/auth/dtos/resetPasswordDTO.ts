import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export default class ResetPasswordDTO {
  @ApiProperty({
    example: 'some-reset-token',
    description: 'Token de reset de senha enviado por email',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'P@ssw0rd123',
    description: 'Nova senha do usuário',
  })
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])/, {
    message:
      'Password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
  })
  password: string;
}
