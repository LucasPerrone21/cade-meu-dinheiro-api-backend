import { Injectable, NotFoundException } from '@nestjs/common';
import { CreditCardRepository } from './creditcard.repository';
import UpdateCreditCardDTO from './dtos/update-credit-card.dto';
import CreateCreditCardDTO from './dtos/create-credit-card.dto';

@Injectable()
export class CreditCardService {
  constructor(private creditCardsRepository: CreditCardRepository) {}

  async createCreditCard(userId: string, dto: CreateCreditCardDTO) {
    return this.creditCardsRepository.createCreditCard(userId, dto);
  }

  async findCreditCardById(id: string, userId: string) {
    const creditCard = await this.creditCardsRepository.findCreditCardById(id);
    if (!creditCard || creditCard.userId !== userId) {
      throw new NotFoundException('Credit card not found');
    }
    return creditCard;
  }

  async findAllCreditCardsByUserId(userId: string) {
    return this.creditCardsRepository.findAllCreditCardsByUserId(userId);
  }

  async deleteCreditCardById(id: string, userId: string) {
    const creditCard = await this.findCreditCardById(id, userId);
    return this.creditCardsRepository.deleteCreditCardById(creditCard.id);
  }

  async updateCreditCardById(
    userId: string,
    id: string,
    dto: UpdateCreditCardDTO,
  ) {
    let creditCard = await this.findCreditCardById(id, userId);

    creditCard = {
      ...creditCard,
      name: dto.name ?? creditCard.name,
      closingDay: dto.closingDay ?? creditCard.closingDay,
      dueDay: dto.dueDay ?? creditCard.dueDay,
      lastFourDigits: dto.lastFourDigits ?? creditCard.lastFourDigits,
    };
    return this.creditCardsRepository.updateCreditCardById(
      creditCard.id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      creditCard.name,
      creditCard.closingDay,
      creditCard.dueDay,
      creditCard.lastFourDigits,
    );
  }
}
