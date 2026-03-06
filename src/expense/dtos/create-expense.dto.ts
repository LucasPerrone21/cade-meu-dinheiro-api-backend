import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  statementId: string;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNotEmpty()
  descriptionOriginal: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  installmentCurrent?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  installmentTotal?: number;
}
