import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Length, Matches, Max, Min } from 'class-validator';

export default class CreateCreditCardDTO {
  @ApiProperty({
    example: 'Cartão de Crédito Visa',
    description: 'Nome do cartão de crédito',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '1234',
    description: 'Últimos 4 dígitos do cartão de crédito',
  })
  @IsNotEmpty()
  @Length(4, 4)
  @Matches(/^\d+$/, { message: 'lastFourDigits must contain only numbers' })
  lastFourDigits: string;

  @ApiProperty({
    example: 15,
    description: 'Dia de fechamento do cartão de crédito',
  })
  @IsInt()
  @Min(1)
  @Max(31)
  closingDay: number;

  @ApiProperty({
    example: 5,
    description: 'Dia de vencimento do cartão de crédito',
  })
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number;
}
