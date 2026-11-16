import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { GetContactsQueryDto } from './dto/get-contacts-query.dto';
import { ContactStatus, Prisma } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateContactDto, ipAddress?: string, userAgent?: string) {
    const contact = await this.prisma.contactMessage.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || null,
        subject: dto.subject?.trim() || null,
        message: dto.message.trim(),
        status: ContactStatus.UNREAD,
        ipAddress: ipAddress || null,
        userAgent: userAgent ? userAgent.substring(0, 500) : null,
      },
    });

    return {
      success: true,
      message: 'Votre message a bien été envoyé. Notre équipe vous répondra dans les plus brefs délais.',
      id: contact.id,
    };
  }

  async findAll(query: GetContactsQueryDto) {
    const { page = 1, limit = 20, status, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ContactMessageWhereInput = {};

    if (status && status !== 'ALL' && Object.values(ContactStatus).includes(status as ContactStatus)) {
      where.status = status as ContactStatus;
    }

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
        { phone: { contains: term, mode: 'insensitive' } },
        { subject: { contains: term, mode: 'insensitive' } },
        { message: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [items, total, unreadCount] = await Promise.all([
      this.prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactMessage.count({ where }),
      this.prisma.contactMessage.count({ where: { status: ContactStatus.UNREAD } }),
    ]);

    return {
      items,
      total,
      unreadCount,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }

    // Automatically transition to READ if currently UNREAD
    if (message.status === ContactStatus.UNREAD) {
      return this.prisma.contactMessage.update({
        where: { id },
        data: { status: ContactStatus.READ },
      });
    }

    return message;
  }

  async updateStatus(id: string, status: ContactStatus, adminUserId: string) {
    const existing = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }

    const updated = await this.prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'UPDATE_CONTACT_STATUS',
      resource: 'ContactMessage',
      payload: { id, oldStatus: existing.status, newStatus: status },
    });

    return updated;
  }

  async delete(id: string, adminUserId: string) {
    const existing = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }

    await this.prisma.contactMessage.delete({
      where: { id },
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'DELETE_CONTACT_MESSAGE',
      resource: 'ContactMessage',
      payload: { id, senderEmail: existing.email, name: existing.name },
    });

    return { success: true, id };
  }
}

