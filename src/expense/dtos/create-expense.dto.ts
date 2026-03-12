import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'ID of the credit card statement this expense belongs to',
    example: 'statement-id',
  })
  @IsNotEmpty()
  statementId: string;

  @ApiProperty({
    description: 'Date of the expense',
    example: '2024-05-01',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({
    description:
      'Original description of the expense as it appears on the credit card statement',
    example: 'Grocery Store - 123 Main St',
  })
  @IsNotEmpty()
  descriptionOriginal: string;

  @ApiProperty({
    description:
      'Normalized description of the expense for better categorization (optional)',
    example: 'Grocery Store',
  })
  @IsOptional()
  descriptionNormalized?: string;

  @ApiProperty({
    description: 'Amount of the expense',
    example: 150.75,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'ID of the category this expense belongs to',
    example: 'category-id',
  })
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Current installment number (optional)',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  installmentCurrent?: number;

  @ApiProperty({
    description: 'Total number of installments (optional)',
    example: 12,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  installmentTotal?: number;
}
