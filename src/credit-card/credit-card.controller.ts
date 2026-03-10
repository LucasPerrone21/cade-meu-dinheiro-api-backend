import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Patch,
  Body,
  Delete,
  Post,
} from '@nestjs/common';
import { CreditCardService } from './credit-card.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import AuthRequest from 'src/auth/interfaces/authRequest';
import UpdateCreditCardDTO from './dtos/update-credit-card.dto';
import CreateCreditCardDTO from './dtos/create-credit-card.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Credit Cards')
@ApiBearerAuth()
@Controller('credit-card')
@UseGuards(JwtAuthGuard)
export class CreditCardController {
  constructor(private creditCardService: CreditCardService) {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Cartão de crédito encontrado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cartão de crédito não encontrado.',
  })
  @ApiOperation({ summary: 'Buscar cartão de crédito por ID' })
  async findCreditCardById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.creditCardService.findCreditCardById(id, req.user.id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Cartões de crédito encontrados com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum cartão de crédito encontrado para o usuário.',
  })
  @ApiOperation({ summary: 'Buscar todos os cartões de crédito do usuário' })
  async findAllCreditCardsByUserId(@Req() req: AuthRequest) {
    return this.creditCardService.findAllCreditCardsByUserId(req.user.id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Cartão de crédito excluído com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cartão de crédito não encontrado.',
  })
  @ApiOperation({ summary: 'Excluir cartão de crédito por ID' })
  async deleteCreditCardById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.creditCardService.deleteCreditCardById(id, req.user.id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Cartão de crédito atualizado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cartão de crédito não encontrado.',
  })
  @ApiOperation({ summary: 'Atualizar cartão de crédito por ID' })
  @ApiBody({ type: UpdateCreditCardDTO })
  async updateCreditCardById(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCreditCardDTO,
  ) {
    return this.creditCardService.updateCreditCardById(req.user.id, id, dto);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Cartão de crédito criado com sucesso.',
  })
  @ApiOperation({ summary: 'Criar um novo cartão de crédito' })
  @ApiBody({ type: CreateCreditCardDTO })
  async createCreditCard(
    @Req() req: AuthRequest,
    @Body() dto: CreateCreditCardDTO,
  ) {
    return this.creditCardService.createCreditCard(req.user.id, dto);
  }
}
