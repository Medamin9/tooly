import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'Plan variant ID to purchase' })
  @IsString()
  @IsNotEmpty()
  planVariantId!: string;

  @ApiProperty({ default: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number = 1;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'customer@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Ahmed Ben Ali' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '+21698123456', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Please send activation to my work email', required: false })
  @IsString()
  @IsOptional()
  customerNotes?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
