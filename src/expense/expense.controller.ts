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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('expense')
@ApiTags('Expense')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Req() req: AuthRequest, @Body() dto: CreateExpenseDto) {
    return this.expenseService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all expenses' })
  @ApiResponse({ status: 200, description: 'Expenses found successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 404, description: 'No expenses found' })
  async findAll(@Query() filter: FilterExpenseDto, @Req() req: AuthRequest) {
    return this.expenseService.findAll(req.user.id, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense found successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async findById(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.expenseService.findById(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing expense' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expenseService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing expense' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async delete(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.expenseService.delete(id, req.user.id);
  }
}
