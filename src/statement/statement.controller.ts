import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateStatementDto } from './dtos/create-statement.dto';
import AuthRequest from 'src/auth/interfaces/authRequest';
import { StatementService } from './statement.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@Controller('statement')
@UseGuards(JwtAuthGuard)
export class StatementController {
  constructor(private statementService: StatementService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createStatement(
    @Body() dto: CreateStatementDto,
    @Req() req: AuthRequest,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.statementService.createStatement(req.user.id, dto, file);
  }

  @Post('process/:id')
  async processStatement(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.statementService.processStatement(id, req.user.id);
  }

  @Get('credit-card/:creditCardId')
  getAllByCreditCardId(
    @Param('creditCardId') creditCardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.statementService.findAllByCreditCardId(
      creditCardId,
      req.user.id,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.statementService.findById(id, req.user.id);
  }

  @Delete(':id')
  async deleteStatement(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.statementService.deleteStatement(id, req.user.id);
  }
}
