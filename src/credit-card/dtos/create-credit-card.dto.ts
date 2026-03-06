import { IsInt, IsNotEmpty, Length, Matches, Max, Min } from 'class-validator';

export default class CreateCreditCardDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Length(4, 4)
  @Matches(/^\d+$/, { message: 'lastFourDigits must contain only numbers' })
  lastFourDigits: string;

  @IsInt()
  @Min(1)
  @Max(31)
  closingDay: number;

  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number;
}
