import { Controller, Get, Put, Post, Body, UseGuards, Delete, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('settings')
export class SettingsController {
  constructor(
    private settingsService: SettingsService,
    private mailService: MailService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async getAll() {
    return this.settingsService.getAll();
  }

  @Get('public')
  async getPublic() {
    const settings = await this.settingsService.getAll() as Record<string, string>;
    return {
      maintenanceMode: settings['maintenanceMode'] || 'false',
      maintenanceEstimate: settings['maintenanceEstimate'] || '',
      siteName: settings['siteName'] || 'Noramu',
      siteDescription: settings['siteDescription'] || 'Premium Minecraft Pluginleri',
      discordLink: settings['discordLink'] || 'https://discord.gg/noramu',
      discordName: settings['discordName'] || 'Discord Sunucumuz',
      contactEmail: settings['contactEmail'] || 'destek@noramu.com',
      workingHoursWeekday: settings['workingHoursWeekday'] || '09:00 - 22:00',
      workingHoursSaturday: settings['workingHoursSaturday'] || '10:00 - 18:00',
      workingHoursSunday: settings['workingHoursSunday'] || '12:00 - 18:00',
      primaryColor: settings['primaryColor'] || '#8B5CF6',
      accentColor: settings['accentColor'] || '#EC4899',
      // Tema sistemi
      siteTheme: settings['siteTheme'] || 'modern',
      // Hero ayarları
      heroTitle1: settings['heroTitle1'] || 'Minecraft için',
      heroTitle2: settings['heroTitle2'] || 'Premium Pluginler',
      heroSubtitle: settings['heroSubtitle'] || 'Sunucunuzu bir üst seviyeye taşıyın. Performans odaklı, güvenilir ve sürekli güncellenen pluginler ile fark yaratın.',
      heroBadgeText: settings['heroBadgeText'] || 'Yeni pluginler eklendi',
      heroBadgeEnabled: settings['heroBadgeEnabled'] || 'true',
      // OAuth ayarları (sadece açık/kapalı durumu)
      googleLoginEnabled: settings['googleLoginEnabled'] || 'false',
      discordLoginEnabled: settings['discordLoginEnabled'] || 'false',
      // Canlı destek ayarları
      liveChatEnabled: settings['liveChatEnabled'] || 'false',
      liveChatWelcome: settings['liveChatWelcome'] || 'Merhaba! Size nasıl yardımcı olabiliriz?',
      liveChatOffline: settings['liveChatOffline'] || 'Şu anda çevrimdışıyız. Lütfen destek talebi oluşturun.',
      liveChatPages: settings['liveChatPages'] || '["home","products","blog","faq","contact"]',
      // Sepet sistemi
      cartSystemEnabled: settings['cartSystemEnabled'] || 'false',
      // Logo ayarları
      siteLogo: settings['siteLogo'] || '',
      siteLogoDark: settings['siteLogoDark'] || '',
      siteFavicon: settings['siteFavicon'] || '',
      // Best Sellers
      bestSellersEnabled: settings['bestSellersEnabled'] || 'false',
    };
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Body() settings: Record<string, string>) {
    await this.settingsService.setMany(settings);
    return this.settingsService.getAll();
  }

  @Post('test-email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async testEmail(@Body() body: { email: string }) {
    await this.mailService.sendTestEmail(body.email);
    return { success: true };
  }

  // Email Verification Whitelist
  @Get('email-verification-whitelist')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getWhitelist() {
    return this.prisma.emailVerificationWhitelist.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('email-verification-whitelist')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async addToWhitelist(@Body() body: { email: string }) {
    const existing = await this.prisma.emailVerificationWhitelist.findUnique({
      where: { email: body.email },
    }).catch(() => null);

    if (existing) {
      return { message: 'Bu e-posta zaten whitelist\'te' };
    }

    return this.prisma.emailVerificationWhitelist.create({
      data: { email: body.email },
    });
  }

  @Delete('email-verification-whitelist/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async removeFromWhitelist(@Param('email') email: string) {
    return this.prisma.emailVerificationWhitelist.delete({
      where: { email },
    }).catch(() => ({ message: 'E-posta bulunamadı' }));
  }
}
