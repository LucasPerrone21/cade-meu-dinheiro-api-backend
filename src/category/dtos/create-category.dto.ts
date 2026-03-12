import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Food',
  })
  @IsNotEmpty()
  name: string;
}
