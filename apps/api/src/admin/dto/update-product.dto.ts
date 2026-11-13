import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OptionalLocalizedFieldDto } from './create-category.dto';
import {
  IsLocalizedStringList,
  LocalizedStringList,
} from '../../common/localized-json.util';

export class UpdatePlanVariantDto {
  @ApiPropertyOptional({ description: 'Existing variant UUID when updating in place' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'claude-pro-1m' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_-]+$/i, {
    message: 'Variant slug must contain only alphanumeric characters, hyphens, and underscores',
  })
  slug!: string;

  @ApiProperty({ example: '1_month' })
  @IsString()
  @IsNotEmpty()
  duration!: string;

  @ApiProperty({ example: 79.0, description: 'Price in TND' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isDemo?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLocalizedStringList()
  features?: string[] | LocalizedStringList;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLocalizedStringList()
  restrictions?: string[] | LocalizedStringList;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'claude-pro' })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Product slug must contain only lowercase alphanumeric characters and hyphens',
  })
  slug?: string;

  @ApiPropertyOptional({ example: 'ai' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  categorySlug?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isDemo?: boolean;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  provider?: string;

  @ApiPropertyOptional({ example: 'OFFLINE_TRANSFER' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'deliveryMethod must be a valid option code (alphanumeric, -, _)',
  })
  @IsOptional()
  deliveryMethod?: string;

  @ApiPropertyOptional({
    nullable: true,
    example: '/uploads/products/prod-uuid.png',
  })
  @IsString()
  @IsOptional()
  @Matches(/^$|^(?!.*\.\.)(\/(uploads|images)\/[a-zA-Z0-9._\/-]+|https?:\/\/[^\s]+)$/, {
    message: 'iconUrl must be a safe upload path, local image path, or http(s) URL',
  })
  iconUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalLocalizedFieldDto)
  name?: OptionalLocalizedFieldDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalLocalizedFieldDto)
  tagline?: OptionalLocalizedFieldDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalLocalizedFieldDto)
  description?: OptionalLocalizedFieldDto;

  @ApiPropertyOptional({ type: [UpdatePlanVariantDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdatePlanVariantDto)
  variants?: UpdatePlanVariantDto[];
}

export class UpdatePlanVariantPriceDto {
  @ApiPropertyOptional({ example: 89.0, description: 'Price in TND' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
