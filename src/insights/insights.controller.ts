import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { InsightsService } from './insights.service';
import { InsightsFilterDto } from './dtos/insights-filter.dto';
import AuthRequest from 'src/auth/interfaces/authRequest';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('insights')
@ApiBearerAuth()
@ApiTags('Insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private insightsService: InsightsService) {}

  @Get('totalByCategory')
  @ApiOperation({ summary: 'Get total expenses grouped by category' })
  @ApiResponse({
    status: 200,
    description: 'Total expenses by category retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  async getTotalByCategory(
    @Query() filter: InsightsFilterDto,
    @Req() req: AuthRequest,
  ) {
    return this.insightsService.getTotalByCategory(req.user.id, filter);
  }

  @Get('topFiveExpenses')
  @ApiOperation({ summary: 'Get top five expenses' })
  @ApiResponse({
    status: 200,
    description: 'Top five expenses retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  async getTopFiveExpenses(
    @Query() filter: InsightsFilterDto,
    @Req() req: AuthRequest,
  ) {
    return this.insightsService.getTopFiveExpenses(req.user.id, filter);
  }

  @Get('expensesByCreditCard')
  @ApiOperation({ summary: 'Get expenses grouped by credit card' })
  @ApiResponse({
    status: 200,
    description: 'Expenses by credit card retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  async getExpensesByCreditCard(
    @Query() filter: InsightsFilterDto,
    @Req() req: AuthRequest,
  ) {
    return this.insightsService.getExpensesByCreditCard(req.user.id, filter);
  }

  @Get('monthlyExpense')
  @ApiOperation({ summary: 'Get monthly spending insights' })
  @ApiResponse({
    status: 200,
    description: 'Monthly spending insights retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  async getMonthlySpending(
    @Query() filter: InsightsFilterDto,
    @Req() req: AuthRequest,
  ) {
    return this.insightsService.getMonthlySpending(req.user.id, filter);
  }
  @Get('statementResume/:id')
  @ApiOperation({ summary: 'Get statement resume insights' })
  @ApiResponse({
    status: 200,
    description: 'Statement resume insights retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid statement ID.' })
  async getStatementResume(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.insightsService.getStatementResume(req.user.id, id);
  }
}
