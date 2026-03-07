import { Injectable } from '@nestjs/common';
import { LogStatus, PipelineStep } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProcessingLogRepository {
  constructor(private prismaService: PrismaService) {}

  async createLog(
    statementId: string,
    step: PipelineStep,
    status: LogStatus,
    message?: string,
    executionTimeMs?: number,
  ) {
    return this.prismaService.processingLog.create({
      data: {
        statementId,
        step,
        status,
        message,
        executionTimeMs,
      },
    });
  }
}
