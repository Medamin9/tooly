import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active categories with localized names and product counts' })
  @ApiQuery({ name: 'locale', required: false, enum: ['ar', 'fr', 'en'] })
  @ApiResponse({ status: 200, description: 'List of active categories' })
  async getCategories(@Query('locale') locale?: 'ar' | 'fr' | 'en'): Promise<CategoryResponseDto[]> {
    return this.categoriesService.getCategories(locale || 'ar');
  }
}
