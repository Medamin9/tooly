import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { AuditService } from '../audit/audit.service';

export interface MulterUploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export const MAX_CATEGORY_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_CLIENT_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/webp',
]);

const SAFE_FILENAME_PATTERNS: Record<'categories' | 'products', RegExp> = {
  categories: /^cat-[a-f0-9-]+\.(jpg|png|webp)$/,
  products: /^prod-[a-f0-9-]+\.(jpg|png|webp)$/,
};

const SCOPE_CONFIG: Record<
  'categories' | 'products',
  { subdir: string; prefix: string; urlPrefix: string; auditAction: string }
> = {
  categories: {
    subdir: 'categories',
    prefix: 'cat',
    urlPrefix: '/uploads/categories',
    auditAction: 'CATEGORY_IMAGE_UPLOADED',
  },
  products: {
    subdir: 'products',
    prefix: 'prod',
    urlPrefix: '/uploads/products',
    auditAction: 'PRODUCT_IMAGE_UPLOADED',
  },
};

export type UploadScope = keyof typeof SCOPE_CONFIG;

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

@Injectable()
export class UploadsService {
  private readonly baseUploadsDir: string;

  constructor(private readonly auditService: AuditService) {
    this.baseUploadsDir = process.env.UPLOADS_DIR
      ? path.resolve(process.env.UPLOADS_DIR)
      : path.resolve(__dirname, '..', '..', 'uploads');
    for (const cfg of Object.values(SCOPE_CONFIG)) {
      fs.mkdirSync(path.join(this.baseUploadsDir, cfg.subdir), {
        recursive: true,
      });
    }
  }

  /**
   * Inspect binary file signature (magic bytes) so we never rely on client MIME headers alone.
   */
  detectImageSignature(
    buffer: Buffer,
  ): { ext: 'jpg' | 'png' | 'webp'; mimeType: string } | null {
    if (!buffer || buffer.length < 12) {
      return null;
    }

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return { ext: 'jpg', mimeType: 'image/jpeg' };
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return { ext: 'png', mimeType: 'image/png' };
    }

    // WebP: "RIFF" .... "WEBP"
    if (
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    ) {
      return { ext: 'webp', mimeType: 'image/webp' };
    }

    return null;
  }

  async saveCategoryImage(
    file: MulterUploadedFile | undefined,
    adminUserId: string,
  ) {
    return this.saveScopedImage('categories', file, adminUserId);
  }

  async saveProductImage(
    file: MulterUploadedFile | undefined,
    adminUserId: string,
  ) {
    return this.saveScopedImage('products', file, adminUserId);
  }

  private async saveScopedImage(
    scope: UploadScope,
    file: MulterUploadedFile | undefined,
    adminUserId: string,
  ): Promise<{
    path: string;
    filename: string;
    mimeType: string;
    size: number;
  }> {
    if (!file || !file.buffer || file.size === 0) {
      throw new BadRequestException('لم يتم إرفاق أي ملف صورة صالح.');
    }

    if (file.size > MAX_CATEGORY_IMAGE_BYTES) {
      throw new BadRequestException(
        'حجم الصورة يتجاوز الحد الأقصى المسموح به (5 ميغابايت).',
      );
    }

    const declaredMime = (file.mimetype || '').toLowerCase();
    if (!ALLOWED_CLIENT_MIMES.has(declaredMime)) {
      throw new BadRequestException(
        'صيغة الملف غير مدعومة. الصيغ المسموح بها: JPG, PNG, WebP.',
      );
    }

    const detected = this.detectImageSignature(file.buffer);
    if (!detected) {
      throw new BadRequestException(
        'محتوى الملف لا يطابق صورة صالحة (JPG أو PNG أو WebP).',
      );
    }

    const cfg = SCOPE_CONFIG[scope];
    const targetDir = path.join(this.baseUploadsDir, cfg.subdir);
    const filename = `${cfg.prefix}-${randomUUID()}.${detected.ext}`;
    const destination = path.join(targetDir, filename);

    await fs.promises.mkdir(targetDir, { recursive: true });
    await fs.promises.writeFile(destination, file.buffer);

    const imagePath = `${cfg.urlPrefix}/${filename}`;

    await this.auditService.logAction({
      userId: adminUserId,
      action: cfg.auditAction,
      resource: `upload:${filename}`,
      payload: {
        filename,
        mimeType: detected.mimeType,
        size: file.size,
      },
    });

    return {
      path: imagePath,
      filename,
      mimeType: detected.mimeType,
      size: file.size,
    };
  }

  getCategoryImageFile(filename: string) {
    return this.getScopedImageFile('categories', filename);
  }

  getProductImageFile(filename: string) {
    return this.getScopedImageFile('products', filename);
  }

  private getScopedImageFile(
    scope: UploadScope,
    filename: string,
  ): {
    filePath: string;
    mimeType: string;
  } {
    if (!SAFE_FILENAME_PATTERNS[scope].test(filename)) {
      throw new NotFoundException('Image not found.');
    }

    const cfg = SCOPE_CONFIG[scope];
    const targetDir = path.join(this.baseUploadsDir, cfg.subdir);
    const resolvedPath = path.resolve(targetDir, filename);
    const expectedPrefix = `${targetDir}${path.sep}`;
    if (!resolvedPath.startsWith(expectedPrefix)) {
      throw new NotFoundException('Image not found.');
    }

    if (!fs.existsSync(resolvedPath)) {
      throw new NotFoundException('Image not found.');
    }

    const ext = path.extname(filename).slice(1).toLowerCase();
    const mimeType = EXT_TO_MIME[ext] || 'application/octet-stream';

    return {
      filePath: resolvedPath,
      mimeType,
    };
  }
}
