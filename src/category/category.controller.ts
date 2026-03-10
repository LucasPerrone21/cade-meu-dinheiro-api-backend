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
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('category')
@ApiTags('Categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of categories retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication is required.',
  })
  async findAll(@Req() req: AuthRequest) {
    return this.categoryService.findAllByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication is required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  async findById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.categoryService.findById(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication is required.',
  })
  @ApiBody({ type: CreateCategoryDTO })
  async create(@Req() req: AuthRequest, @Body() dto: CreateCategoryDTO) {
    return this.categoryService.createCategory(req.user.id, dto);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCategoryDTO })
  @ApiOperation({ summary: 'Update an existing category by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication is required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  async updateById(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDTO,
    @Req() req: AuthRequest,
  ) {
    return this.categoryService.updateCategoryById(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication is required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  async deleteById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.categoryService.deleteCategoryById(id, req.user.id);
  }
}
