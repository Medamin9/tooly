import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthResponse } from '@tooly/contracts';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check API service health and uptime' })
  @ApiResponse({ status: 200, description: 'Service is operational' })
  getHealth(): HealthResponse {
    return this.healthService.check();
  }
}
