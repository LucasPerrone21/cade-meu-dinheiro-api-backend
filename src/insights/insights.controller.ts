import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { InsightsService } from './insights.service';
import { InsightsFilterDto } from './dtos/insights-filter.dto';
import AuthRequest from 'src/auth/interfaces/authRequest';

@Controller('insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private insightsService: InsightsService) {}

  @Get('totalByCategory')
  async getTotalByCategory(
    @Query() filter: InsightsFilterDto,
    @Req() req: AuthRequest,
  ) {
    return this.insightsService.getTotalByCategory(req.user.id, filter);
  }

  @Get('topFiveExpenses')
  async getTopFiveExpenses(
    @Query() filter: InsightsFilterDto,
    @Req() req: AuthRequest,
  ) {
    return this.insightsService.getTopFiveExpenses(req.user.id, filter);
  }

  @Get('expensesByCreditCard')
  async getExpensesByCreditCard(
    @Query() filter: InsightsFilterDto,
    @Req() req: AuthRequest,
  ) {
    return this.insightsService.getExpensesByCreditCard(req.user.id, filter);
  }

  @Get('monthlyExpense')
  async getMonthlySpending(
    @Query() filter: InsightsFilterDto,
    @Req() req: AuthRequest,
  ) {
    return this.insightsService.getMonthlySpending(req.user.id, filter);
  }
  @Get('statementResume/:id')
  async getStatementResume(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.insightsService.getStatementResume(req.user.id, id);
  }
}
