import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { AuditService } from '../audit/audit.service';
import {
  MAX_CATEGORY_IMAGE_BYTES,
  MulterUploadedFile,
  UploadsService,
} from './uploads.service';

describe('UploadsService', () => {
  let service: UploadsService;
  let tempUploadsDir: string;
  let auditMock: { logAction: jest.Mock };

  beforeAll(() => {
    tempUploadsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tooly-uploads-test-'));
    process.env.UPLOADS_DIR = tempUploadsDir;
  });

  afterAll(() => {
    delete process.env.UPLOADS_DIR;
    fs.rmSync(tempUploadsDir, { recursive: true, force: true });
  });

  beforeEach(async () => {
    auditMock = { logAction: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsService,
        {
          provide: AuditService,
          useValue: auditMock,
        },
      ],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
  });

  it('saves a valid PNG image with a generated filename and logs audit', async () => {
    // Valid PNG magic bytes + minimal trailing bytes
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    ]);

    const file: MulterUploadedFile = {
      fieldname: 'file',
      originalname: '../../evil-name.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: pngBuffer.length,
      buffer: pngBuffer,
    };

    const result = await service.saveCategoryImage(file, 'admin-1');

    expect(result.filename).toMatch(/^cat-[a-f0-9-]+\.png$/);
    expect(result.path).toBe(`/uploads/categories/${result.filename}`);
    expect(result.mimeType).toBe('image/png');
    expect(auditMock.logAction).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'admin-1',
        action: 'CATEGORY_IMAGE_UPLOADED',
      }),
    );

    const served = service.getCategoryImageFile(result.filename);
    expect(fs.existsSync(served.filePath)).toBe(true);
    expect(served.mimeType).toBe('image/png');
  });

  it('rejects spoofed MIME files whose content is not a valid image signature', async () => {
    const htmlPayload = Buffer.from('<script>alert(1)</script>', 'utf-8');
    const file: MulterUploadedFile = {
      fieldname: 'file',
      originalname: 'banner.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: htmlPayload.length,
      buffer: htmlPayload,
    };

    await expect(service.saveCategoryImage(file, 'admin-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects files larger than MAX_CATEGORY_IMAGE_BYTES', async () => {
    const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const file: MulterUploadedFile = {
      fieldname: 'file',
      originalname: 'huge.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: MAX_CATEGORY_IMAGE_BYTES + 1,
      buffer: jpegHeader,
    };

    await expect(service.saveCategoryImage(file, 'admin-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('blocks path traversal attempts when serving category images', () => {
    expect(() => service.getCategoryImageFile('../package.json')).toThrow(
      NotFoundException,
    );
    expect(() => service.getCategoryImageFile('cat-1234.svg')).toThrow(
      NotFoundException,
    );
  });
});

