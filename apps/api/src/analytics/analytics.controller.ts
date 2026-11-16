import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { RecordVisitDto } from './dto/record-visit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request } from 'express';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('visit')
  @ApiOperation({ summary: 'Record an anonymous website visit from the storefront' })
  @ApiResponse({ status: 201, description: 'Visit recorded' })
  async recordVisit(@Body() dto: RecordVisitDto, @Req() req: Request) {
    const rawIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      undefined;
    const userAgent = req.headers['user-agent'];

    return this.analyticsService.recordVisit(dto, rawIp, userAgent);
  }
}

@ApiTags('Admin Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/analytics')
export class AdminAnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('visits')
  @ApiOperation({ summary: 'Get aggregated website visit metrics for the Admin Dashboard' })
  async getVisitMetrics() {
    return this.analyticsService.getVisitMetrics();
  }
}

