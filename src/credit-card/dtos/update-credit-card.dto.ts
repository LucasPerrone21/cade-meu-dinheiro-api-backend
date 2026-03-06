import { PartialType } from '@nestjs/mapped-types';
import CreateCreditCardDTO from './create-credit-card.dto';

export default class UpdateCreditCardDTO extends PartialType(
  CreateCreditCardDTO,
) {}
