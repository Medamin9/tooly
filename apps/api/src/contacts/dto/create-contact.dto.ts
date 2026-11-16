import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Ahmed Ben Ali', description: 'Sender full name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'ahmed@example.tn', description: 'Sender email' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: '+216 98 000 000', required: false, description: 'Sender phone or WhatsApp' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string;

  @ApiProperty({ example: 'Demande de devis pour équipe', required: false, description: 'Subject of the message' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  subject?: string;

  @ApiProperty({
    example: 'Bonjour, je souhaite souscrire un abonnement Claude pour 5 utilisateurs...',
    description: 'Message body',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(5000)
  message!: string;
}

