import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockUser = {
    id: 'user-1',
    email: 'admin@tooly.tn',
    name: 'Admin',
    passwordHash: '',
    role: Role.ADMIN,
    isActive: true,
  };

  beforeAll(async () => {
    mockUser.passwordHash = await bcrypt.hash('CorrectPassword123!', 10);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(({ where }: { where: { email: string } }) => {
                if (where.email === 'admin@tooly.tn') return Promise.resolve(mockUser);
                return Promise.resolve(null);
              }),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mock_jwt_token'),
          },
        },
        {
          provide: AuditService,
          useValue: {
            logAction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user with correct password and return user without hash', async () => {
    const user = await service.validateUser('admin@tooly.tn', 'CorrectPassword123!');
    expect(user.id).toBe('user-1');
    expect(user.email).toBe('admin@tooly.tn');
    expect((user as any).passwordHash).toBeUndefined();
  });

  it('should throw UnauthorizedException on wrong password', async () => {
    await expect(service.validateUser('admin@tooly.tn', 'WrongPass123!')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException for nonexistent email', async () => {
    await expect(service.validateUser('unknown@tooly.tn', 'Pass123456!')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should login and return signed JWT token and user info', async () => {
    const result = await service.login({
      email: 'admin@tooly.tn',
      password: 'CorrectPassword123!',
    });

    expect(result.accessToken).toBe('mock_jwt_token');
    expect(result.user.role).toBe(Role.ADMIN);
  });
});
