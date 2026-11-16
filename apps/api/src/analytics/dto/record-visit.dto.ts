import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordVisitDto {
  @ApiProperty({ example: '/ar/catalog', description: 'Visited pathname' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  path!: string;

  @ApiProperty({ example: 'ar', required: false, description: 'Active locale' })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  locale?: string;

  @ApiProperty({ example: 'vid-12345678', required: false, description: 'Anonymous client visitor token' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  visitorId?: string;

  @ApiProperty({ example: 'https://google.com', required: false, description: 'Referrer URL' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  referrer?: string;
}

