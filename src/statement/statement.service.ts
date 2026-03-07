import { Injectable, NotFoundException } from '@nestjs/common';
import { StatementRepository } from './statement.repositoty';
import { CreateStatementDto } from './dtos/create-statement.dto';
import { CreditCardService } from 'src/credit-card/credit-card.service';
import { StorageService } from 'src/storage/storage.service';
import { AiService } from 'src/ai/ai.service';
import { CategoryService } from 'src/category/category.service';
import { ExpenseService } from 'src/expense/expense.service';

@Injectable()
export class StatementService {
  constructor(
    private statementRepository: StatementRepository,
    private expenseService: ExpenseService,
    private creditCardService: CreditCardService,
    private storageService: StorageService,
    private aiService: AiService,
    private categoryService: CategoryService,
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

  private async downloadFile(filePath: string) {
    const fileStream = await this.storageService.downloadFile(filePath);
    return fileStream;
  }

  async processStatement(statementId: string, userId: string) {
    const statement = await this.findById(statementId, userId);
    if (!statement.filePath) {
      throw new NotFoundException('No file associated with this statement');
    }
    try {
      const buffer = await this.downloadFile(statement.filePath);
      const categories = await this.categoryService.findAllSystemCategories();
      const categoryNames = categories.map((c) => c.name);
      const aiResponse = await this.aiService.extractExpensesFromPdf(
        buffer,
        categoryNames,
      );

      for (const expense of aiResponse.expenses) {
        const category = categories.find(
          (c) => c.name === expense.categoryName,
        );
        if (!category) {
          continue;
        }
        await this.expenseService.create(userId, {
          statementId,
          date: new Date(expense.date),
          amount: expense.amount,
          descriptionOriginal: expense.descriptionOriginal,
          descriptionNormalized: expense.descriptionNormalized,
          categoryId: category.id,
          installmentCurrent: expense.installmentCurrent ?? undefined,
          installmentTotal: expense.installmentTotal ?? undefined,
        });
      }

      await this.statementRepository.updateStatement(statementId, {
        totalAmount: aiResponse.totalAmount,
        dueDate: new Date(aiResponse.dueDate),
        rawAiResponse: JSON.stringify(aiResponse),
        processedAt: new Date(),
      });
    } catch (error) {
      await this.statementRepository.updateStatus(statementId, 'FAILED');
      throw error;
    }
  }
}
