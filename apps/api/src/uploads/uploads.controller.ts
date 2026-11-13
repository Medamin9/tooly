import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { createReadStream } from 'fs';
import type { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UploadRateLimitGuard } from './upload-rate-limit.guard';
import {
  MAX_CATEGORY_IMAGE_BYTES,
  MulterUploadedFile,
  UploadsService,
} from './uploads.service';

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/webp',
]);

const imageUploadInterceptor = () =>
  FileInterceptor('file', {
    // Omit dest/storage so Multer buffers in memory for magic-byte inspection before writing to disk
    limits: {
      fileSize: MAX_CATEGORY_IMAGE_BYTES,
      files: 1,
    },
    fileFilter: (_req, file, cb) => {
      if (!ALLOWED_MIMES.has((file.mimetype || '').toLowerCase())) {
        return cb(
          new BadRequestException(
            'صيغة الملف غير مدعومة. الصيغ المسموح بها: JPG, PNG, WebP.',
          ),
          false,
        );
      }
      cb(null, true);
    },
  });

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard, UploadRateLimitGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a category banner image (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Category image uploaded successfully' })
  @UseInterceptors(imageUploadInterceptor())
  async uploadCategoryImage(
    @UploadedFile() file: MulterUploadedFile | undefined,
    @Req() req: { user: { id: string } },
  ) {
    return this.uploadsService.saveCategoryImage(file, req.user.id);
  }

  @Get('categories/:filename')
  @ApiOperation({ summary: 'Serve a publicly uploaded category image safely' })
  serveCategoryImage(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const { filePath, mimeType } =
      this.uploadsService.getCategoryImageFile(filename);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    return new StreamableFile(createReadStream(filePath));
  }

  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard, UploadRateLimitGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a product icon/logo image (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product image uploaded successfully' })
  @UseInterceptors(imageUploadInterceptor())
  async uploadProductImage(
    @UploadedFile() file: MulterUploadedFile | undefined,
    @Req() req: { user: { id: string } },
  ) {
    return this.uploadsService.saveProductImage(file, req.user.id);
  }

  @Get('products/:filename')
  @ApiOperation({ summary: 'Serve a publicly uploaded product image safely' })
  serveProductImage(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const { filePath, mimeType } =
      this.uploadsService.getProductImageFile(filename);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    return new StreamableFile(createReadStream(filePath));
  }
}
