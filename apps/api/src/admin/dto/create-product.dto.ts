import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryMethod } from '@prisma/client';

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
  slug!: string;

  @ApiProperty({ example: '1_month' })
  @IsString()
  @IsNotEmpty()
  duration!: string;

  @ApiProperty({ example: 79.0, description: 'Price in TND' })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;

  @ApiProperty({ example: ['Full access to Claude 3.5'] })
  @IsOptional()
  features?: string[];

  @ApiProperty({ example: ['Single user access'] })
  @IsOptional()
  restrictions?: string[];
}

export class CreateProductDto {
  @ApiProperty({ example: 'claude-pro' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ example: 'ai' })
  @IsString()
  @IsNotEmpty()
  categorySlug!: string;

  @ApiProperty({ example: 'Anthropic' })
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @ApiProperty({ enum: DeliveryMethod, default: DeliveryMethod.OFFLINE_TRANSFER })
  @IsEnum(DeliveryMethod)
  @IsOptional()
  deliveryMethod?: DeliveryMethod = DeliveryMethod.OFFLINE_TRANSFER;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = true;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number = 0;

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
  @ValidateNested({ each: true })
  @Type(() => CreatePlanVariantDto)
  variants!: CreatePlanVariantDto[];
}
