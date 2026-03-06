import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateCreditCardDTO from './dtos/create-credit-card.dto';

@Injectable()
export class CreditCardRepository {
  constructor(private prismaService: PrismaService) {}

  async createCreditCard(userId: string, dto: CreateCreditCardDTO) {
    return this.prismaService.creditCard.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAllCreditCardsByUserId(userId: string) {
    return this.prismaService.creditCard.findMany({
      where: {
        userId,
      },
    });
  }

  async findCreditCardById(id: string) {
    return this.prismaService.creditCard.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteCreditCardById(id: string) {
    return this.prismaService.creditCard.delete({
      where: {
        id,
      },
    });
  }

  async updateCreditCardById(
    id: string,
    name: string,
    closingDay: number,
    dueDay: number,
    lastFourDigits: string,
  ) {
    return this.prismaService.creditCard.update({
      where: {
        id,
      },
      data: {
        name,
        closingDay,
        dueDay,
        lastFourDigits,
      },
    });
  }
}
