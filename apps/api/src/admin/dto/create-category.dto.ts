import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LocalizedFieldDto } from './create-product.dto';

export class OptionalLocalizedFieldDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ar?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fr?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  en?: string;
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'security', description: 'URL-friendly unique identifier' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase alphanumeric characters and hyphens',
  })
  slug!: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number = 0;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ required: false, nullable: true, example: '/uploads/categories/cat-uuid.jpg', description: 'Category banner or image path' })
  @IsString()
  @IsOptional()
  @Matches(/^$|^(?!.*\.\.)(\/(uploads|images)\/[a-zA-Z0-9._\/-]+|https?:\/\/[^\s]+)$/, {
    message: 'imageUrl must be a safe upload path, local image path, or http(s) URL',
  })
  imageUrl?: string | null;

  @ApiProperty({ description: 'Localized names (ar, fr, en)' })
  @ValidateNested()
  @Type(() => LocalizedFieldDto)
  name!: LocalizedFieldDto;

  @ApiProperty({ required: false, description: 'Localized descriptions (optional)' })
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalLocalizedFieldDto)
  description?: OptionalLocalizedFieldDto;
}

