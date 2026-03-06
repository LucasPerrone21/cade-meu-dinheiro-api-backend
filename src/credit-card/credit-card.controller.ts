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

@Controller('credit-card')
@UseGuards(JwtAuthGuard)
export class CreditCardController {
  constructor(private creditCardService: CreditCardService) {}

  @Get(':id')
  async findCreditCardById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.creditCardService.findCreditCardById(id, req.user.id);
  }

  @Get()
  async findAllCreditCardsByUserId(@Req() req: AuthRequest) {
    return this.creditCardService.findAllCreditCardsByUserId(req.user.id);
  }

  @Delete(':id')
  async deleteCreditCardById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.creditCardService.deleteCreditCardById(id, req.user.id);
  }

  @Patch(':id')
  async updateCreditCardById(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCreditCardDTO,
  ) {
    return this.creditCardService.updateCreditCardById(req.user.id, id, dto);
  }

  @Post()
  async createCreditCard(
    @Req() req: AuthRequest,
    @Body() dto: CreateCreditCardDTO,
  ) {
    return this.creditCardService.createCreditCard(req.user.id, dto);
  }
}
