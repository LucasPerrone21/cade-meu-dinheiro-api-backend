import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class InsightsFilterDto {
  @ApiPropertyOptional({
    description: 'Start date for filtering insights',
    example: '2024-01-01',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date for filtering insights',
    example: '2024-12-31',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Credit card ID for filtering insights',
    example: 'credit-card-id',
  })
  @IsOptional()
  creditCardId?: string;
}
