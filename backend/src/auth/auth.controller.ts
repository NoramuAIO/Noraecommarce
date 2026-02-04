import { Controller, Post, Body, Get, UseGuards, Request, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register endpoint - Rate Limited
   * Brute force koruması: 5 attempts per minute per IP
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string }) {
    return this.authService.register(body.email, body.password, body.name);
  }

  /**
   * Login endpoint - Rate Limited
   * Brute force koruması: 5 attempts per minute per IP
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  /**
   * Email verification - Rate Limited
   * 10 attempts per minute per IP
   */
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  /**
   * Resend verification email - Rate Limited
   * 3 attempts per minute per IP
   */
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('resend-verification')
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
  }

  /**
   * Forgot password - Rate Limited
   * 3 attempts per minute per IP
   */
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  /**
   * Reset password - Rate Limited
   * 5 attempts per minute per IP
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }
}
