import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard, AdminGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('test')
  async testNotification(@Body() body: { platform: 'discord' | 'telegram' }) {
    const success = await this.notificationsService.sendTestNotification(body.platform);
    return { success, message: success ? 'Test bildirimi gönderildi' : 'Bildirim gönderilemedi' };
  }
}
