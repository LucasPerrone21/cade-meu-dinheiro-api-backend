import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateStatementDto {
  @ApiProperty({
    description: 'The ID of the credit card associated with the statement',
    example: '12345-123456-12345678',
  })
  @IsNotEmpty()
  creditCardId: string;

  @ApiProperty({
    description: 'The reference month for the statement',
    example: '2023-10-01',
  })
  @Type(() => Date)
  @IsDate()
  referenceMonth: Date;
}
