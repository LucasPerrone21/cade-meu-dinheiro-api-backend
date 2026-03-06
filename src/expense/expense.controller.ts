import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import AuthRequest from 'src/auth/interfaces/authRequest';
import { FilterExpenseDto } from './dtos/filter-expense.dto';
import { UpdateExpenseDto } from './dtos/update-expense.dto';

@Controller('expense')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Post()
  async create(@Req() req: AuthRequest, @Body() dto: CreateExpenseDto) {
    return this.expenseService.create(req.user.id, dto);
  }

  @Get()
  async findAll(@Query() filter: FilterExpenseDto, @Req() req: AuthRequest) {
    return this.expenseService.findAll(req.user.id, filter);
  }

  @Get(':id')
  async findById(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.expenseService.findById(id, req.user.id);
  }

  @Patch(':id')
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expenseService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  async delete(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.expenseService.delete(id, req.user.id);
  }
}
