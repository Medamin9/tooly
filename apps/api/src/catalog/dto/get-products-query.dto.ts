import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOption {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NEWEST = 'newest',
  SORT_ORDER = 'sort_order',
}

export class GetProductsQueryDto {
  @ApiPropertyOptional({ enum: ['ar', 'fr', 'en'], default: 'ar' })
  @IsEnum(['ar', 'fr', 'en'])
  @IsOptional()
  locale?: 'ar' | 'fr' | 'en' = 'ar';

  @ApiPropertyOptional({ description: 'Filter by category slug' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Search term for product name or description' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by duration (e.g. 1_month, 3_months, 1_year)' })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiPropertyOptional({ enum: SortOption, default: SortOption.SORT_ORDER })
  @IsEnum(SortOption)
  @IsOptional()
  sort?: SortOption = SortOption.SORT_ORDER;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 12, maximum: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 12;
}
