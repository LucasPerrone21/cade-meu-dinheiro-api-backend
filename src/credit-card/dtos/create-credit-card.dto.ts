import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Length, Matches, Max, Min } from 'class-validator';

export default class CreateCreditCardDTO {
  @ApiProperty({
    example: 'Visa Gold',
    description: 'Credit card name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '1234',
    description: 'Last four digits of the credit card',
  })
  @IsNotEmpty()
  @Length(4, 4)
  @Matches(/^\d+$/, { message: 'lastFourDigits must contain only numbers' })
  lastFourDigits: string;

  @ApiProperty({
    example: 15,
    description: 'Credit card closing day',
  })
  @IsInt()
  @Min(1)
  @Max(31)
  closingDay: number;

  @ApiProperty({
    example: 5,
    description: 'Credit card due day',
  })
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number;
}
