import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CatalogOptionKind } from '@prisma/client';
import { LocalizedFieldDto } from './create-product.dto';
import { OptionalLocalizedFieldDto } from './create-category.dto';

export class CreateCatalogOptionDto {
  @ApiProperty({ enum: CatalogOptionKind, example: CatalogOptionKind.DELIVERY_METHOD })
  @IsEnum(CatalogOptionKind)
  kind!: CatalogOptionKind;

  @ApiProperty({ example: 'd17_instant', description: 'Unique code within kind' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Option code must contain only alphanumeric characters, hyphens, and underscores',
  })
  code!: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocalizedFieldDto)
  label!: LocalizedFieldDto;

  @ApiPropertyOptional({ default: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sortOrder?: number = 0;
}

export class UpdateCatalogOptionDto {
  @ApiPropertyOptional({ example: 'd17_instant' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Option code must contain only alphanumeric characters, hyphens, and underscores',
  })
  code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalLocalizedFieldDto)
  label?: OptionalLocalizedFieldDto;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

