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
    description: 'Credit card found successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Credit card not found.',
  })
  @ApiOperation({ summary: 'Find a credit card by ID' })
  async findCreditCardById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.creditCardService.findCreditCardById(id, req.user.id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Credit cards found successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'No credit cards found for the user.',
  })
  @ApiOperation({ summary: 'Find all credit cards for the user' })
  async findAllCreditCardsByUserId(@Req() req: AuthRequest) {
    return this.creditCardService.findAllCreditCardsByUserId(req.user.id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Credit card deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Credit card not found.',
  })
  @ApiOperation({ summary: 'Delete a credit card by ID' })
  async deleteCreditCardById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.creditCardService.deleteCreditCardById(id, req.user.id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Credit card updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Credit card not found.',
  })
  @ApiOperation({ summary: 'Update a credit card by ID' })
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
    description: 'Credit card created successfully.',
  })
  @ApiOperation({ summary: 'Create a new credit card' })
  @ApiBody({ type: CreateCreditCardDTO })
  async createCreditCard(
    @Req() req: AuthRequest,
    @Body() dto: CreateCreditCardDTO,
  ) {
    return this.creditCardService.createCreditCard(req.user.id, dto);
  }
}
