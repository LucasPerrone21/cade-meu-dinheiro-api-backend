import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsDateString,
} from 'class-validator';

export default class SignUpDTO {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email do usuário, deve ser único',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd123',
    description:
      'Senha do usuário, deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais',
  })
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])/, {
    message:
      'Password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nome completo do usuário',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Data de nascimento do usuário',
  })
  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;
}
