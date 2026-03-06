import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  name: string;
}
