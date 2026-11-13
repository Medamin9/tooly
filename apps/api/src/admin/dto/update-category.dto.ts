import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OptionalLocalizedFieldDto } from './create-category.dto';

export class UpdateCategoryDto {
  @ApiProperty({ required: false, example: 'security' })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase alphanumeric characters and hyphens',
  })
  slug?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false, nullable: true, example: '/uploads/categories/cat-uuid.jpg', description: 'Category banner or image path' })
  @IsString()
  @IsOptional()
  @Matches(/^$|^(?!.*\.\.)(\/(uploads|images)\/[a-zA-Z0-9._\/-]+|https?:\/\/[^\s]+)$/, {
    message: 'imageUrl must be a safe upload path, local image path, or http(s) URL',
  })
  imageUrl?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalLocalizedFieldDto)
  name?: OptionalLocalizedFieldDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalLocalizedFieldDto)
  description?: OptionalLocalizedFieldDto;
}

