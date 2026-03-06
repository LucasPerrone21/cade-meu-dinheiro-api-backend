import { Injectable, NotFoundException } from '@nestjs/common';
import { StatementRepository } from './statement.repositoty';
import { CreateStatementDto } from './dtos/create-statement.dto';
import { CreditCardService } from 'src/credit-card/credit-card.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class StatementService {
  constructor(
    private statementRepository: StatementRepository,
    private creditCardService: CreditCardService,
    private storageService: StorageService,
  ) {}

  async createStatement(
    userId: string,
    dto: CreateStatementDto,
    file?: Express.Multer.File,
  ) {
    let fileKey: string | undefined;
    await this.creditCardService.findCreditCardById(dto.creditCardId, userId);
    if (file) {
      fileKey = `statements/${userId}/${Date.now()}.pdf`;
      await this.storageService.uploadFile(
        Buffer.from(file.buffer) as Buffer<ArrayBufferLike>,
        fileKey,
        'application/pdf',
      );
    }

    const referenceMonth = new Date(dto.referenceMonth);
    referenceMonth.setDate(1);

    const statement = await this.statementRepository.createStatement(
      userId,
      {
        ...dto,
        referenceMonth: new Date(referenceMonth),
      },
      fileKey,
    );
    return statement;
  }

  async findAllByCreditCardId(creditCardId: string, userId: string) {
    await this.creditCardService.findCreditCardById(creditCardId, userId);
    const statements =
      await this.statementRepository.findAllByCreditCardId(creditCardId);
    return statements;
  }

  async findById(statementId: string, userId: string) {
    const statement = await this.statementRepository.findById(statementId);
    if (!statement || statement.userId !== userId) {
      throw new NotFoundException('Statement not found');
    }
    return statement;
  }

  async deleteStatement(statementId: string, userId: string) {
    const statement = await this.findById(statementId, userId);
    if (statement.filePath) {
      await this.storageService.deleteFile(statement.filePath);
    }
    await this.statementRepository.deleteStatement(statementId);
  }
}
