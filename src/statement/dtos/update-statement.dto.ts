import { PartialType } from '@nestjs/mapped-types';
import { CreateStatementDto } from './create-statement.dto';

export class UpdateStatementDto extends PartialType(CreateStatementDto) {}
