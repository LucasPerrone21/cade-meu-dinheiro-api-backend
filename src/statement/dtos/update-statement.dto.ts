import { PartialType } from '@nestjs/swagger';
import { CreateStatementDto } from './create-statement.dto';

export class UpdateStatementDto extends PartialType(CreateStatementDto) {}
