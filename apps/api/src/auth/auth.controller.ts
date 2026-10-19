import { Controller, Post, Body, Get, UseGuards, Req, Ip } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful with JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Ip() ipAddress: string) {
    return this.authService.login(loginDto, ipAddress);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Authenticated profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: { user: unknown }) {
    return req.user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out user' })
  logout() {
    return { status: 'logged_out', message: 'Session closed successfully' };
  }
}
