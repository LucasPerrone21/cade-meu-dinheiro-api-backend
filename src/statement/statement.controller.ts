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
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

@Controller('statement')
@ApiTags('Statement')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StatementController {
  constructor(private statementService: StatementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new statement' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The statement was created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid statement data.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', title: 'Statement PDF file' },
        creditCardId: { type: 'string' },
        referenceMonth: { type: 'string', format: 'date' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async createStatement(
    @Body() dto: CreateStatementDto,
    @Req() req: AuthRequest,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.statementService.createStatement(req.user.id, dto, file);
  }

  @Post('process/:id')
  @ApiOperation({ summary: 'Process a statement' })
  @ApiResponse({
    status: 200,
    description: 'The statement was processed successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Statement not found.',
  })
  async processStatement(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.statementService.processStatement(id, req.user.id);
  }

  @Post('reprocess/:id')
  @ApiOperation({ summary: 'Reprocess a statement' })
  @ApiResponse({
    status: 200,
    description: 'The statement was reprocessed successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Statement not found.',
  })
  async reprocessStatement(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.statementService.reprocessStatement(id, req.user.id);
  }

  @Get('credit-card/:creditCardId')
  @ApiOperation({ summary: 'Get all statements for a credit card' })
  @ApiResponse({
    status: 200,
    description: 'List of statements retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Credit card not found.',
  })
  async getAllByCreditCardId(
    @Param('creditCardId') creditCardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.statementService.findAllByCreditCardId(
      creditCardId,
      req.user.id,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a statement by ID' })
  @ApiResponse({
    status: 200,
    description: 'The statement was retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Statement not found.',
  })
  async findById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.statementService.findById(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a statement' })
  @ApiResponse({
    status: 200,
    description: 'The statement was deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Statement not found.',
  })
  async deleteStatement(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.statementService.deleteStatement(id, req.user.id);
  }
}
