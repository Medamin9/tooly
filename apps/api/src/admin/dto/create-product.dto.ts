import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
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
import {
  IsLocalizedStringList,
  LocalizedStringList,
} from '../../common/localized-json.util';

export class LocalizedFieldDto {
  @ApiProperty({ example: 'Claude 3.5 Pro' })
  @IsString()
  @IsNotEmpty()
  ar!: string;

  @ApiProperty({ example: 'Claude 3.5 Pro' })
  @IsString()
  @IsNotEmpty()
  fr!: string;

  @ApiProperty({ example: 'Claude 3.5 Pro' })
  @IsString()
  @IsNotEmpty()
  en!: string;
}

export class CreatePlanVariantDto {
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

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isDemo?: boolean = false;

  @ApiPropertyOptional({
    example: { ar: ['وصول كامل'], fr: ['Accès complet'], en: ['Full access'] },
  })
  @IsOptional()
  @IsLocalizedStringList()
  features?: string[] | LocalizedStringList;

  @ApiPropertyOptional({
    example: { ar: ['مستخدم واحد'], fr: ['Un utilisateur'], en: ['Single user'] },
  })
  @IsOptional()
  @IsLocalizedStringList()
  restrictions?: string[] | LocalizedStringList;
}

export class CreateProductDto {
  @ApiProperty({ example: 'claude-pro' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Product slug must contain only lowercase alphanumeric characters and hyphens',
  })
  slug!: string;

  @ApiProperty({ example: 'ai' })
  @IsString()
  @IsNotEmpty()
  categorySlug!: string;

  @ApiProperty({ example: 'Anthropic' })
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @ApiProperty({ example: 'OFFLINE_TRANSFER', default: 'OFFLINE_TRANSFER' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'deliveryMethod must be a valid option code (alphanumeric, -, _)',
  })
  @IsOptional()
  deliveryMethod?: string = 'OFFLINE_TRANSFER';

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = true;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isDemo?: boolean = false;

  @ApiProperty({ default: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sortOrder?: number = 0;

  @ApiPropertyOptional({
    nullable: true,
    example: '/uploads/products/prod-uuid.png',
    description: 'Product logo or icon URL',
  })
  @IsString()
  @IsOptional()
  @Matches(/^$|^(?!.*\.\.)(\/(uploads|images)\/[a-zA-Z0-9._\/-]+|https?:\/\/[^\s]+)$/, {
    message: 'iconUrl must be a safe upload path, local image path, or http(s) URL',
  })
  iconUrl?: string | null;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocalizedFieldDto)
  name!: LocalizedFieldDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocalizedFieldDto)
  tagline!: LocalizedFieldDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocalizedFieldDto)
  description!: LocalizedFieldDto;

  @ApiProperty({ type: [CreatePlanVariantDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePlanVariantDto)
  variants!: CreatePlanVariantDto[];
}
