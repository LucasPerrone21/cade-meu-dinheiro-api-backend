import { Module } from '@nestjs/common';
import { ProcessingLogRepository } from './processing-log.repository';

@Module({
  providers: [ProcessingLogRepository],
  exports: [ProcessingLogRepository],
})
export class ProcessingLogModule {}
