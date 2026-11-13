import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { UploadRateLimitGuard } from './upload-rate-limit.guard';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [AuditModule],
  controllers: [UploadsController],
  providers: [UploadsService, UploadRateLimitGuard],
  exports: [UploadsService],
})
export class UploadsModule {}

