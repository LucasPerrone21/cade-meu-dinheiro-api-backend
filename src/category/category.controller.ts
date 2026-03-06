import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import AuthRequest from 'src/auth/interfaces/authRequest';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import UpdateCategoryDTO from './dtos/update-category.dto';

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async findAll(@Req() req: AuthRequest) {
    return this.categoryService.findAllByUserId(req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.categoryService.findById(id, req.user.id);
  }

  @Post()
  async create(@Req() req: AuthRequest, @Body() dto: CreateCategoryDTO) {
    return this.categoryService.createCategory(req.user.id, dto);
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDTO,
    @Req() req: AuthRequest,
  ) {
    return this.categoryService.updateCategoryById(id, dto, req.user.id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.categoryService.deleteCategoryById(id, req.user.id);
  }
}
