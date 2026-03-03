import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export default class ResetPasswordDTO {
  @IsNotEmpty()
  token: string;

  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])/, {
    message:
      'Password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
  })
  password: string;
}
