import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  provider?: string;
}

export class UpdatePlanVariantPriceDto {
  @ApiPropertyOptional({ example: 89.0, description: 'Price in TND' })
  @IsNumber()
  price!: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
