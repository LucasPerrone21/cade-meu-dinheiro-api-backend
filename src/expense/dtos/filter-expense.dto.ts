import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FilterExpenseDto {
  @ApiPropertyOptional({
    description: 'ID of the credit card statement to filter expenses',
    example: 'statement-id',
  })
  @IsOptional()
  statementId?: string;

  @ApiPropertyOptional({
    description: 'ID of the credit card to filter expenses',
    example: 'credit-card-id',
  })
  @IsOptional()
  creditCardId?: string;

  @ApiPropertyOptional({
    description: 'ID of the category to filter expenses',
    example: 'category-id',
  })
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Start date to filter expenses',
    example: '2024-01-01',
  })
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date to filter expenses',
    example: '2024-12-31',
  })
  @IsOptional()
  @Type(() => Date)
  finalDate?: Date;
}
