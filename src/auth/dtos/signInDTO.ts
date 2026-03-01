import { IsEmail, IsNotEmpty } from 'class-validator';

export default class SignInDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
