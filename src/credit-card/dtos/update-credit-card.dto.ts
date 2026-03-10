import { PartialType } from '@nestjs/swagger';
import CreateCreditCardDTO from './create-credit-card.dto';

export default class UpdateCreditCardDTO extends PartialType(
  CreateCreditCardDTO,
) {}
