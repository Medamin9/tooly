import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdatePlanVariantPriceDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CreateCatalogOptionDto,
  UpdateCatalogOptionDto,
} from './dto/catalog-option.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get real administrative metrics and recent activity' })
  @ApiResponse({ status: 200, description: 'Administrative metrics' })
  async getOverview() {
    return this.adminService.getOverview();
  }

  @Get('products')
  @ApiOperation({ summary: 'List all products with variants for administration' })
  async getProducts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getProducts(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      search,
    );
  }

  @Post('products')
  @ApiOperation({ summary: 'Create a new product with localized contents and plan variants' })
  async createProduct(@Body() dto: CreateProductDto, @Req() req: { user: { id: string } }) {
    return this.adminService.createProduct(dto, req.user.id);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update product publication status or sorting' })
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.adminService.updateProduct(id, dto, req.user.id);
  }

  @Patch('variants/:id/price')
  @ApiOperation({ summary: 'Update plan variant price in TND or availability' })
  async updateVariantPrice(
    @Param('id') id: string,
    @Body() dto: UpdatePlanVariantPriceDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.adminService.updateVariantPrice(id, dto, req.user.id);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete a product' })
  async deleteProduct(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.adminService.deleteProduct(id, req.user.id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all categories with localized data and product counts' })
  async getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create a new category with multilingual translations' })
  async createCategory(@Body() dto: CreateCategoryDto, @Req() req: { user: { id: string } }) {
    return this.adminService.createCategory(dto, req.user.id);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update a category and its multilingual translations' })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.adminService.updateCategory(id, dto, req.user.id);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete a category if it has no associated products' })
  async deleteCategory(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.adminService.deleteCategory(id, req.user.id);
  }

  @Get('options')
  @ApiOperation({ summary: 'List all delivery methods and duration options with usage counts' })
  async getCatalogOptions() {
    return this.adminService.getCatalogOptions();
  }

  @Post('options')
  @ApiOperation({ summary: 'Create a new delivery method or duration option' })
  async createCatalogOption(
    @Body() dto: CreateCatalogOptionDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.adminService.createCatalogOption(dto, req.user.id);
  }

  @Patch('options/:id')
  @ApiOperation({ summary: 'Update a delivery method or duration option and cascade code renames' })
  async updateCatalogOption(
    @Param('id') id: string,
    @Body() dto: UpdateCatalogOptionDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.adminService.updateCatalogOption(id, dto, req.user.id);
  }

  @Delete('options/:id')
  @ApiOperation({ summary: 'Delete an unused delivery method or duration option' })
  async deleteCatalogOption(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.adminService.deleteCatalogOption(id, req.user.id);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Browse recent administrative audit logs' })
  async getAuditLogs(@Query('limit') limit?: number) {
    return this.adminService.getAuditLogs(limit ? Number(limit) : 50);
  }
}
