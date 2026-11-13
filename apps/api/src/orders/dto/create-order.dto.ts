import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
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
  @ApiProperty({ example: 'customer@example.com', required: false })
  @IsOptional()
  @ValidateIf((o) => typeof o.email === 'string' && o.email.trim().length > 0)
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Ahmed Ben Ali', required: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '+21698123456', required: true })
  @IsString()
  @IsNotEmpty()
  phone!: string;

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
