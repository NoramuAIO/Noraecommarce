import { Controller, Get, Query, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SettingsService } from '../settings/settings.service';

interface OAuthSettings {
  googleLoginEnabled?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  googleRedirectUri?: string;
  discordLoginEnabled?: string;
  discordClientId?: string;
  discordClientSecret?: string;
  discordRedirectUri?: string;
  [key: string]: string | undefined;
}

@Controller('auth/oauth')
export class OAuthController {
  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
  ) {}

  // Google OAuth
  @Get('google')
  async googleAuth(@Res() res: Response) {
    const settings = await this.settingsService.getAll() as OAuthSettings;
    
    if (settings.googleLoginEnabled !== 'true') {
      throw new UnauthorizedException('Google ile giriş kapalı');
    }

    const clientId = settings.googleClientId;
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const redirectUri = settings.googleRedirectUri || `${backendUrl}/api/auth/oauth/google/callback`;
    
    const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('email profile')}` +
      `&access_type=offline`;

    res.redirect(url);
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const settings = await this.settingsService.getAll() as OAuthSettings;
      
      if (settings.googleLoginEnabled !== 'true') {
        throw new UnauthorizedException('Google ile giriş kapalı');
      }

      const clientId = settings.googleClientId;
      const clientSecret = settings.googleClientSecret;
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
      const redirectUri = settings.googleRedirectUri || `${backendUrl}/api/auth/oauth/google/callback`;

      // Token al
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId || '',
          client_secret: clientSecret || '',
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenRes.json();

      if (!tokenData.access_token) {
        throw new UnauthorizedException('Google token alınamadı');
      }

      // Kullanıcı bilgilerini al
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      const userData = await userRes.json();

      // Kullanıcıyı bul veya oluştur
      const result = await this.authService.findOrCreateOAuthUser({
        email: userData.email,
        name: userData.name,
        avatar: userData.picture,
        provider: 'google',
        providerId: userData.id,
      });

      // Frontend'e yönlendir
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${result.token}`);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }

  // Discord OAuth
  @Get('discord')
  async discordAuth(@Res() res: Response) {
    const settings = await this.settingsService.getAll() as OAuthSettings;
    
    if (settings.discordLoginEnabled !== 'true') {
      throw new UnauthorizedException('Discord ile giriş kapalı');
    }

    const clientId = settings.discordClientId;
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const redirectUri = settings.discordRedirectUri || `${backendUrl}/api/auth/oauth/discord/callback`;
    
    const url = `https://discord.com/api/oauth2/authorize?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('identify email')}`;

    res.redirect(url);
  }

  @Get('discord/callback')
  async discordCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const settings = await this.settingsService.getAll() as OAuthSettings;
      
      if (settings.discordLoginEnabled !== 'true') {
        throw new UnauthorizedException('Discord ile giriş kapalı');
      }

      const clientId = settings.discordClientId;
      const clientSecret = settings.discordClientSecret;
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
      const redirectUri = settings.discordRedirectUri || `${backendUrl}/api/auth/oauth/discord/callback`;

      // Token al
      const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId || '',
          client_secret: clientSecret || '',
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenRes.json();

      if (!tokenData.access_token) {
        throw new UnauthorizedException('Discord token alınamadı');
      }

      // Kullanıcı bilgilerini al
      const userRes = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      const userData = await userRes.json();

      // Discord avatar URL oluştur
      let avatarUrl: string | undefined;
      if (userData.avatar) {
        // Animasyonlu avatar için gif, normal için webp (daha iyi kalite)
        const ext = userData.avatar.startsWith('a_') ? 'gif' : 'webp';
        avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.${ext}?size=256`;
      }

      // Kullanıcıyı bul veya oluştur
      const result = await this.authService.findOrCreateOAuthUser({
        email: userData.email,
        name: userData.global_name || userData.username,
        avatar: avatarUrl,
        provider: 'discord',
        providerId: userData.id,
      });

      // Frontend'e yönlendir
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${result.token}`);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }
}
