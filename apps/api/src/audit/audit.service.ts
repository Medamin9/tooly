import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logAction(params: {
    userId?: string;
    action: string;
    resource: string;
    payload?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    try {
      const record = await this.prisma.auditLog.create({
        data: {
          userId: params.userId || null,
          action: params.action,
          resource: params.resource,
          payload: (params.payload as Prisma.InputJsonValue) || Prisma.JsonNull,
          ipAddress: params.ipAddress || null,
        },
      });
      this.logger.log(`[AUDIT] Action: ${params.action} on ${params.resource} by ${params.userId || 'system'}`);
      return record;
    } catch (error) {
      this.logger.error(`Failed to record audit log: ${(error as Error).message}`);
    }
  }

  async getRecentLogs(limit = 50) {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });
  }
}
