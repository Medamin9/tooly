import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * Simple sliding/fixed window rate limiter protecting admin upload endpoints against abuse.
 * Allows up to 20 uploads per 60 seconds per authenticated user or IP.
 */
@Injectable()
export class UploadRateLimitGuard implements CanActivate {
  private readonly windowMs = 60_000;
  private readonly maxRequests = 20;
  private readonly buckets = new Map<string, RateLimitEntry>();

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      user?: { id?: string };
      ip?: string;
    }>();

    const key = req.user?.id || req.ip || 'anonymous';
    const now = Date.now();

    // Periodically prune expired buckets to avoid unbounded growth
    if (this.buckets.size > 1000) {
      for (const [entryKey, entry] of this.buckets.entries()) {
        if (entry.resetAt <= now) {
          this.buckets.delete(entryKey);
        }
      }
    }

    const existing = this.buckets.get(key);
    if (!existing || existing.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (existing.count >= this.maxRequests) {
      throw new HttpException(
        'تم تجاوز الحد المسموح به لرفع الصور مؤقتاً. يرجى المحاولة بعد دقيقة.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    existing.count += 1;
    return true;
  }
}

