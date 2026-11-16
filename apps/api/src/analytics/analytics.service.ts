import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecordVisitDto } from './dto/record-visit.dto';
import * as crypto from 'crypto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Safe accessor for pageView delegate ensuring full IDE & runtime compatibility
   */
  private get pageViewModel(): any {
    return (this.prisma as any).pageView;
  }

  /**
   * Record an anonymous page view from the storefront
   */
  async recordVisit(dto: RecordVisitDto, rawIp?: string, userAgent?: string) {
    const cleanPath = (dto.path || '/').trim();

    // Do not record internal administration or backend API routes
    if (cleanPath.startsWith('/admin') || cleanPath.startsWith('/api') || cleanPath.includes('/_next/')) {
      return { ok: true, ignored: true };
    }

    // Privacy-respecting IP hash (anonymized, non-reversible without internal salt)
    let ipHash: string | null = null;
    if (rawIp) {
      ipHash = crypto
        .createHash('sha256')
        .update(rawIp + '_tooly_salt_visit_tracking')
        .digest('hex')
        .substring(0, 32);
    }

    try {
      await this.pageViewModel.create({
        data: {
          path: cleanPath,
          locale: (dto.locale || 'ar').toLowerCase().substring(0, 5),
          visitorId: dto.visitorId ? dto.visitorId.substring(0, 100) : null,
          ipHash,
          userAgent: userAgent ? userAgent.substring(0, 500) : null,
          referrer: dto.referrer ? dto.referrer.substring(0, 1000) : null,
        },
      });

      return { ok: true };
    } catch (error) {
      this.logger.warn(`Failed to record page view: ${(error as Error).message}`);
      return { ok: false };
    }
  }

  /**
   * Aggregate traffic and website visit KPIs for the Admin Dashboard
   */
  async getVisitMetrics() {
    const now = new Date();

    // Start of Today (Tunisia time: UTC+1)
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);

    // Past 7 Days threshold
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const [totalVisits, todayVisits, weeklyVisits, uniqueVisitorGroups, topPathGroups, recentViews] =
      await Promise.all([
        this.pageViewModel.count(),
        this.pageViewModel.count({
          where: { createdAt: { gte: todayStart } },
        }),
        this.pageViewModel.count({
          where: { createdAt: { gte: sevenDaysAgo } },
        }),
        this.pageViewModel.groupBy({
          by: ['visitorId'],
          where: { visitorId: { not: null } },
        }),
        this.pageViewModel.groupBy({
          by: ['path'],
          _count: { path: true },
          orderBy: { _count: { path: 'desc' } },
          take: 5,
        }),
        this.pageViewModel.findMany({
          where: { createdAt: { gte: sevenDaysAgo } },
          select: { createdAt: true },
          orderBy: { createdAt: 'asc' },
        }),
      ]);

    // Compute unique visitors (distinct visitor IDs, minimum of 1 if visits exist)
    const uniqueCount = (uniqueVisitorGroups as Array<any>).length > 0
      ? (uniqueVisitorGroups as Array<any>).length
      : totalVisits > 0 ? 1 : 0;

    // Build 7-day daily trend array
    const daysMap: Record<string, number> = {};
    const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const isoDate = d.toISOString().split('T')[0];
      daysMap[isoDate] = 0;
    }

    (recentViews as Array<{ createdAt: Date }>).forEach((view) => {
      const iso = view.createdAt.toISOString().split('T')[0];
      if (daysMap[iso] !== undefined) {
        daysMap[iso]++;
      }
    });

    const dailyTrend = Object.entries(daysMap).map(([dateStr, count]) => {
      const d = new Date(dateStr + 'T12:00:00Z');
      const label = dayNamesAr[d.getUTCDay()];
      return {
        date: dateStr,
        label,
        count,
      };
    });

    const topPages = (topPathGroups as Array<{ path: string; _count: { path: number } }>).map((g) => ({
      path: g.path,
      count: g._count.path,
    }));

    return {
      totalVisits,
      todayVisits,
      uniqueVisitors: uniqueCount,
      weeklyVisits,
      dailyTrend,
      topPages,
    };
  }
}

