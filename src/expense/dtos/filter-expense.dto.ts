import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FilterExpenseDto {
  @IsOptional()
  statementId?: string;

  @IsOptional()
  creditCardId?: string;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  finalDate?: Date;
}
