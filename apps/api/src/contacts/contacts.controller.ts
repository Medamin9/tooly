import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { GetContactsQueryDto } from './dto/get-contacts-query.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request } from 'express';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new contact message or inquiry from the storefront' })
  @ApiResponse({ status: 201, description: 'Message received successfully' })
  async create(@Body() dto: CreateContactDto, @Req() req: Request) {
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      undefined;
    const userAgent = req.headers['user-agent'];

    return this.contactsService.create(dto, ipAddress, userAgent);
  }
}

@ApiTags('Admin Contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/contacts')
export class AdminContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'List all contact messages with filtering, searching, and pagination' })
  async findAll(@Query() query: GetContactsQueryDto) {
    return this.contactsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific contact message by ID (marks as read automatically)' })
  async findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update contact message processing status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateContactStatusDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.contactsService.updateStatus(id, dto.status, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact message' })
  async delete(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.contactsService.delete(id, req.user.id);
  }
}

