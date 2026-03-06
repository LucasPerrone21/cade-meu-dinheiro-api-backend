import { Module } from '@nestjs/common';
import { CreditCardController } from './credit-card.controller';
import { CreditCardService } from './credit-card.service';
import { CreditCardRepository } from './creditcard.repository';

@Module({
  controllers: [CreditCardController],
  providers: [CreditCardService, CreditCardRepository],
})
export class CreditCardModule {}
