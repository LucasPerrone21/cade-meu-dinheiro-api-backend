import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStatementDto } from './dtos/create-statement.dto';
import { StatementStatus } from 'generated/prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatementRepository {
  constructor(private prismaService: PrismaService) {}

  async createStatement(
    userId: string,
    dto: CreateStatementDto,
    filePath?: string,
  ) {
    const statement = await this.prismaService.statement.create({
      data: {
        userId,
        creditCardId: dto.creditCardId,
        referenceMonth: dto.referenceMonth,
        filePath: filePath ?? null,
      },
    });
    return statement;
  }

  async findAllByCreditCardId(creditCardId: string) {
    const statements = await this.prismaService.statement.findMany({
      where: {
        creditCardId,
      },
    });
    return statements;
  }

  async findById(id: string) {
    const statement = await this.prismaService.statement.findFirst({
      where: {
        id,
      },
    });
    return statement;
  }

  async deleteStatement(id: string) {
    await this.prismaService.statement.deleteMany({
      where: {
        id,
      },
    });
  }

  async updateStatus(id: string, status: StatementStatus) {
    await this.prismaService.statement.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
