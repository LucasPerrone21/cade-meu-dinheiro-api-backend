import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateStatementDto {
  @IsNotEmpty()
  creditCardId: string;

  @Type(() => Date)
  @IsDate()
  referenceMonth: Date;
}
