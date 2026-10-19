import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { PaginatedProductsResponseDto, ProductResponseDto } from './dto/product-response.dto';

@ApiTags('Catalog')
@Controller('products')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @ApiOperation({ summary: 'Browse published products with pagination, search, category, and duration filters' })
  @ApiResponse({ status: 200, description: 'List of matching published products' })
  async getProducts(@Query() query: GetProductsQueryDto): Promise<PaginatedProductsResponseDto> {
    return this.catalogService.getProducts(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get detailed product information by slug with localized content and plan variants' })
  @ApiParam({ name: 'slug', description: 'Product slug identifier (e.g. claude-pro, canva-pro)' })
  @ApiQuery({ name: 'locale', required: false, enum: ['ar', 'fr', 'en'] })
  @ApiResponse({ status: 200, description: 'Product details' })
  @ApiResponse({ status: 404, description: 'Product not found or unpublished' })
  async getProductBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: 'ar' | 'fr' | 'en',
  ): Promise<ProductResponseDto> {
    return this.catalogService.getProductBySlug(slug, locale || 'ar');
  }
}
