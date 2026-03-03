import { IsEmail, IsNotEmpty } from 'class-validator';

export default class ForgotPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
