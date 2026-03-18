import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { HelperController } from './helper.controller';

@Module({
  providers: [HelperService],
  controllers: [HelperController]
})
export class HelperModule {}
